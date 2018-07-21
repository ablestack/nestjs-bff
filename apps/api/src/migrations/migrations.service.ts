import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { Model, set as mongooseSet } from 'mongoose';
import * as path from 'path';
import * as tsnode from 'ts-node';
import { LoggerService } from '../common/services/logger.service';
import { Migration, MigrationState } from './interfaces/migration.interface';

// mongooseSet('debug', true);

@Injectable()
export class MigrationsService {
  private readonly relativePaths = {
    migrationScripts: '../../migrations/standard',
    customScripts: '../../migrations/custom',
    migrationsTemplate: './templates/migrationTemplate.ts',
  };

  private readonly absolutePaths = {
    migrationScripts: null as string,
    customScripts: null as string,
    migrationsTemplate: null as string,
  };

  private readonly template;

  constructor(
    private readonly loggerService: LoggerService,
    @Inject('MigrationModelToken') private readonly migrationModel: Model<Migration>,
  ) {
    // set absolute paths
    this.absolutePaths.migrationScripts = path.resolve(__dirname, this.relativePaths.migrationScripts);
    this.absolutePaths.customScripts = path.resolve(__dirname, this.relativePaths.customScripts);
    this.absolutePaths.migrationsTemplate = path.resolve(__dirname, this.relativePaths.migrationsTemplate);

    // initialize objects
    this.template = fs.readFileSync(this.absolutePaths.migrationsTemplate, 'utf-8');
  }

  /**
   *
   * @param direction {string}
   * @param migrationFilename {string}
   */
  public async runCustomMigration(direction: string = 'up', migrationFilename: string) {
    const tsnodeCompiler = tsnode.register({ transpileOnly: true } as tsnode.Options);
    const migrationFilePath = path.join(this.absolutePaths.customScripts, migrationFilename);

    try {
      const directionalMigrationFunction = await this.getDirectionalMigrationFunction(
        migrationFilePath,
        direction,
        migrationFilename,
      );
      if (!directionalMigrationFunction) return;

      await this.runMigrationFunction(directionalMigrationFunction);
      this.loggerService.log(`Migration successfully ran: ${migrationFilename} (${direction.toUpperCase()})`);
    } catch (e) {
      this.loggerService.error(`Failed to run migration ${migrationFilePath} due to an error.`, e);
      this.loggerService.warn(`Not continuing. Make sure your data is in consistent state`);
      throw e;
    }
  }

  /**
   * Create a new migration
   * @param {string} migrationName
   * @returns {Promise<Object>} A promise of the Migration created
   */
  public async create(migrationName: string) {
    // validate migration doesn't already exist
    const existingMigration = await this.migrationModel.findOne({ name: migrationName });
    if (!!existingMigration) {
      throw new Error(`There is already a migration with name '${migrationName}' in the database`);
    }

    const migrationCreatedDate = Date.now();

    // create file system file
    const newMigrationFileName = `${migrationCreatedDate}-${migrationName}.ts`;
    fs.writeFileSync(path.join(this.absolutePaths.migrationScripts, newMigrationFileName), this.template);

    // create instance in db
    const createdMigration = new this.migrationModel({
      name: migrationName,
      createdAt: migrationCreatedDate,
    });

    await createdMigration.save();
    this.loggerService.log(`Created migration ${migrationName} in ${this.absolutePaths.migrationScripts}.`);
  }

  /**
   * Runs migrations up to or down to a given migration name.
   * If no name given, all migrations are run.
   *
   * @param migrationName
   * @param direction
   */
  public async runMigration(direction: string = 'up', migrationName?: string) {
    const untilMigration = migrationName
      ? await this.migrationModel.findOne({ name: migrationName })
      : await this.migrationModel.findOne().sort({ createdAt: -1 });

    if (!untilMigration) {
      if (migrationName) throw new ReferenceError('Could not find that migration in the database');
      else throw new Error('There are no pending migrations.');
    }

    let query;
    if (direction === 'down') {
      query = {
        createdAt: { $gte: untilMigration.createdAt },
        state: 'up',
      };
    } else {
      query = {
        createdAt: { $lte: untilMigration.createdAt },
        state: 'down',
      };
    }

    const sortDirection = direction === 'up' ? 1 : -1;
    const migrationsToRun = await this.migrationModel.find(query).sort({ createdAt: sortDirection });

    if (!migrationsToRun.length) {
      this.loggerService.warn('There are no migrations to run');
      this.loggerService.warn(`Current Migrations' Statuses: `);
      await this.list();
    }

    let numMigrationsRun = 0;
    const tsnodeCompiler = tsnode.register({ transpileOnly: true } as tsnode.Options);

    for (const migration of migrationsToRun) {
      const migrationFilePath = path.join(this.absolutePaths.migrationScripts, migration.filename);
      try {
        const directionalMigrationFunction = await this.getDirectionalMigrationFunction(
          migrationFilePath,
          direction,
          migration.filename,
        );
        if (!directionalMigrationFunction) return;

        // run migration
        await this.runMigrationFunction(directionalMigrationFunction);

        // update migrations table
        const completed = await this.migrationModel
          .where(null, { name: migration.name })
          .update({ $set: { state: direction } });
        this.loggerService.log(`migration models updated: ${JSON.stringify(completed)}`);

        // log completed
        this.loggerService.log(`${migration.filename} (${direction.toUpperCase()})`);

        numMigrationsRun++;
      } catch (err) {
        this.loggerService.error(`Failed to run migration ${migrationFilePath} due to an error.`, err.stack);
        this.loggerService.warn(`Not continuing. Make sure your data is in consistent state`);
        throw err;
      }
    }

    this.loggerService.log(`Migrations run: ${numMigrationsRun}`);
  }

  /**
   * Looks at the file system migrations and imports any migrations that are
   * on the file system but missing in the database into the database
   *
   * This functionality is opposite of prune()
   */
  public async sync() {
    try {
      const { filesNotInDb } = await this.compareFileSystemWithDB();
      let migrationsToImport = filesNotInDb;

      this.loggerService.log('Synchronizing database with file system migrations...');

      if (migrationsToImport.length === 0) {
        this.loggerService.log('There are no migrations to synchronize');
      } else {
        await inquirer
          .prompt({
            type: 'checkbox',
            message:
              'The following migrations exist in the migrations folder but not in the database. Select the ones you want to import into the database',
            name: 'migrationsToImport',
            choices: filesNotInDb,
          })
          .then(answers => {
            migrationsToImport = (answers as any).migrationsToImport;
          });
      }

      const promises = [];
      for (const migrationToImport of migrationsToImport) {
        promises.push(
          new Promise((resolve, reject) => {
            const { filePath, migrationName, timestamp } = this.getFilenameParts(migrationToImport);

            this.loggerService.log(
              `Adding migration ${filePath} into database require(file system. State is ` + `DOWN`,
            );

            this.migrationModel
              .create({
                name: migrationName,
                createdAt: timestamp,
              })
              .then(createdMigration => {
                this.loggerService.log(`Migration created: ${JSON.stringify(createdMigration.toJSON())}`);
                resolve(createdMigration);
              });
          }),
        );

        await Promise.all(promises).catch(reason =>
          this.loggerService.error(
            `Could not synchronize migrations in the migrations folder up to the database`,
            reason,
          ),
        );
      }
    } catch (error) {
      this.loggerService.error(
        `Could not synchronize migrations in the migrations folder up to the database.`,
        error.stack,
      );
      throw error;
    }
  }

  /**
   * Opposite of sync().
   * Removes files in the database which don't exist in the migrations directory.
   */
  public async prune() {
    try {
      const { dbMigrationsNotOnFs } = await this.compareFileSystemWithDB();
      let migrationsToDelete = dbMigrationsNotOnFs.map(m => m.name);

      if (migrationsToDelete.length === 0) {
        this.loggerService.log('There are no migrations to prune');
      } else {
        await inquirer
          .prompt({
            type: 'checkbox',
            message:
              'The following migrations exist in the database but not in the migrations folder. Select the migrations you want to remove from the database.',
            name: 'migrationsToDelete',
            choices: migrationsToDelete,
          })
          .then(answers => {
            migrationsToDelete = (answers as any).migrationsToDelete;
          });
      }

      const migrationsToDeleteDocs = await this.migrationModel
        .find({
          name: { $in: migrationsToDelete },
        })
        .lean();

      if (migrationsToDelete.length) {
        this.loggerService.log(`Removing migration(s) ${migrationsToDelete.join(', ')} from database`);
        await this.migrationModel.remove({
          name: { $in: migrationsToDelete },
        });
      }

      return migrationsToDeleteDocs;
    } catch (error) {
      this.loggerService.error(`Could not prune extraneous migrations from database.`);
      throw error;
    }
  }

  /**
   * Lists the current migrations and their statuses
   * @returns {Promise<Array<Object>>}
   * @example
   *   [
   *    { name: 'my-migration', filename: '149213223424_my-migration.js', state: 'up' },
   *    { name: 'add-cows', filename: '149213223453_add-cows.js', state: 'down' }
   *   ]
   */
  public async list() {
    const {
      migrationsInDatabase,
      migrationsInFolder,
      filesNotInDb,
      dbMigrationsNotOnFs,
    } = await this.compareFileSystemWithDB();

    this.loggerService.log(
      `There are ${migrationsInDatabase.length} migration documents in the database, and ${
        migrationsInFolder.length
      } migration files on the file system.`,
    );

    if (migrationsInDatabase.length > 0) {
      this.loggerService.log('\n');
      this.loggerService.log(`The following migrations are in the database:`);
      migrationsInDatabase.map(m => {
        this.loggerService.log(`${m.filename} (${m.state === MigrationState.Up ? 'UP:' : 'DOWN'})`);
      });
    }

    if (dbMigrationsNotOnFs.length > 0) {
      this.loggerService.log('\n');
      this.loggerService.log(
        `The following migrations exist in the database, but not the filesystem. (Run the migrations-prune command to remove these from the database): `,
      );
      dbMigrationsNotOnFs.map(m => {
        this.loggerService.log(`${m.filename} (${m.state === MigrationState.Up ? 'UP' : 'DOWN'})`);
      });
    }

    if (filesNotInDb.length > 0) {
      this.loggerService.log('\n');
      this.loggerService.log(
        `The following migrations exist on the filesystem, but not the database. (Run the migrations-sync command to add these to the database): `,
      );
      filesNotInDb.map(m => {
        this.loggerService.log(m);
      });
    }
  }

  private async compareFileSystemWithDB() {
    const filesInMigrationFolder = fs.readdirSync(this.absolutePaths.migrationScripts);
    const migrationsInDatabase = await this.migrationModel.find({}).sort({ createdAt: 1 });
    const migrationsInFolder = filesInMigrationFolder.filter(file => /\d{13,}\-.+.(ts)$/.test(file)).map(filename => {
      const fileCreatedAt = +filename.split('-')[0];
      const existsInDatabase = migrationsInDatabase.some(m => filename === m.filename);
      return { createdAt: fileCreatedAt, filename, existsInDatabase };
    });

    const filesNotInDb = migrationsInFolder
      .filter(migrationInFolder => migrationInFolder.existsInDatabase === false)
      .map(f => f.filename);
    const dbMigrationsNotOnFs = migrationsInDatabase.filter(migrationInDB => {
      return !migrationsInFolder.find(migrationInFolder => migrationInFolder.filename === migrationInDB.filename);
    });
    return { migrationsInDatabase, migrationsInFolder, filesNotInDb, dbMigrationsNotOnFs };
  }

  private getFilenameParts(migrationToImport: string) {
    const filePath = path.join(this.absolutePaths.migrationScripts, migrationToImport);
    const timestampSeparatorIndex = migrationToImport.indexOf('-');
    const timestamp = migrationToImport.slice(0, timestampSeparatorIndex);
    const migrationName = migrationToImport.slice(timestampSeparatorIndex + 1, migrationToImport.lastIndexOf('.'));
    return { filePath, migrationName, timestamp };
  }

  private async getDirectionalMigrationFunction(
    migrationFilePath: string,
    direction: string,
    migrationFilename: string,
  ) {
    let migrationFunctions;
    // tslint:disable-next-line:whitespace
    migrationFunctions = await import(migrationFilePath);

    this.loggerService.debug(migrationFunctions);

    if (!migrationFunctions) {
      this.loggerService.error(`The migration file '${migrationFilePath}' could not be loaded.`);
      return null;
    }

    const directionalMigrationFunction = migrationFunctions[direction];
    if (!directionalMigrationFunction) {
      this.loggerService.error(`The ${direction} export is not defined in ${migrationFilename}.`);
      return null;
    }
    return directionalMigrationFunction;
  }

  private async runMigrationFunction(directionalMigrationFunction: any) {
    await new Promise((resolve, reject) => {
      const callPromise = directionalMigrationFunction.call(
        null,
        this.migrationModel.collection.conn,
        this.loggerService,
        function callback(err) {
          if (err) return reject(err);
          resolve();
        },
      );
      if (callPromise && typeof callPromise.then === 'function') {
        callPromise.then(resolve).catch(reject);
      }
    });
  }
}
