import { Inject, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as inquirer from 'inquirer';
import { Model } from 'mongoose';
import * as path from 'path';
import * as tsnode from 'ts-node';
import { LoggerSysService } from '../../shared/logging/logger.shared.service';
import { IMigration, MigrationState } from './interfaces/migration.interface';
import { MigrationsProviderTokens } from './migrations.shared.constants';

// mongooseSet('debug', true);

@Injectable()
export class MigrationsSysService {
  private readonly relativePaths = {
    migrationScriptsRoot: 'src/migrations',
    customScripts: 'src/migrations/custom',
    migrationsTemplate: './templates/migrationTemplate.ts',
  };

  private readonly absolutePaths = {
    migrationScriptsRoot: '',
    customScripts: '',
    migrationsTemplate: '',
  };

  private readonly template;

  constructor(
    private readonly bffLoggerService: LoggerSysService,
    @Inject(MigrationsProviderTokens.Models.Migration)
    private readonly migrationModel: Model<IMigration>,
  ) {
    // set absolute paths
    this.absolutePaths.migrationScriptsRoot = path.resolve(
      process.cwd(),
      this.relativePaths.migrationScriptsRoot,
    );
    this.absolutePaths.customScripts = path.resolve(
      process.cwd(),
      this.relativePaths.customScripts,
    );
    this.absolutePaths.migrationsTemplate = path.resolve(
      __dirname,
      this.relativePaths.migrationsTemplate,
    );

    // initialize objects
    this.template = fs.readFileSync(
      this.absolutePaths.migrationsTemplate,
      'utf-8',
    );
  }

  /**
   *
   * @param direction {string}
   * @param migrationRelativePath {string}
   */
  public async runCustomMigration(
    direction: string = 'up',
    migrationRelativePath: string,
  ) {
    tsnode.register({ transpileOnly: true } as tsnode.Options);
    const migrationFilePath = this.getCustomMigrationFilePath(
      migrationRelativePath,
    );

    try {
      const directionalMigrationFunction = await this.getDirectionalMigrationFunction(
        migrationFilePath,
        direction,
        migrationRelativePath,
      );
      if (!directionalMigrationFunction) return;

      await this.runMigrationFunction(directionalMigrationFunction);
      this.bffLoggerService.log(
        `Migration successfully ran: ${migrationRelativePath} (${direction.toUpperCase()})`,
      );
    } catch (e) {
      this.bffLoggerService.error(
        `Failed to run migration ${migrationFilePath} due to an error.`,
        e,
      );
      this.bffLoggerService.warn(
        `Not continuing. Make sure your data is in consistent state`,
      );
      throw e;
    }
  }

  public getCustomMigrationFilePath(migrationFilename: string) {
    return path.join(this.absolutePaths.customScripts, migrationFilename);
  }

  /**
   * Create a new migration
   * @param {string} migrationName
   * @returns {Promise<Object>} A promise of the Migration created
   */
  public async create(migrationGroup: string, migrationName: string) {
    // validate migration doesn't already exist
    const existingMigration = await this.migrationModel.findOne({
      name: migrationName,
    });
    if (!!existingMigration) {
      throw new Error(
        `There is already a migration with name '${migrationName}' in the database`,
      );
    }

    const migrationCreatedDate = Date.now();

    // create file system file
    const newMigrationFileName = `${migrationCreatedDate}-${migrationName}.ts`;
    const newMigrationFilePath = path.join(
      this.absolutePaths.migrationScriptsRoot,
      migrationGroup,
      newMigrationFileName,
    );
    fs.writeFileSync(newMigrationFilePath, this.template);

    // create instance in db
    const createdMigration = new this.migrationModel({
      name: migrationName,
      createdAt: migrationCreatedDate,
    });

    await createdMigration.save();
    this.bffLoggerService.log(
      `Created migration ${migrationName} in ${newMigrationFilePath}.`,
    );
  }

  public async autoRunMigrations(migrationGroup: string) {
    try {
      this.bffLoggerService.info(
        `About to run migrations for group: ${migrationGroup}`,
      );
      this.sync(migrationGroup, false);
      this.runMigration(migrationGroup);
      this.bffLoggerService.info(`Ran migrations for group: ${migrationGroup}`);
    } catch (error) {
      this.bffLoggerService.error(error);
    }
  }

  /**
   * Runs migrations up to or down to a given migration name.
   * If no name given, all migrations are run.
   *
   * @param migrationName
   * @param direction
   */
  public async runMigration(
    migrationGroup: string,
    direction: string = 'up',
    migrationName?: string,
  ) {
    const untilMigration = migrationName
      ? await this.migrationModel.findOne({ name: migrationName })
      : await this.migrationModel.findOne().sort({ createdAt: -1 });

    if (!untilMigration) {
      if (migrationName) {
        throw new ReferenceError(
          'Could not find that migration in the database',
        );
      }
      // no migrations to run
      this.bffLoggerService.info(`There are no migrations to run`);
      return;
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
    const migrationsToRun = await this.migrationModel
      .find(query)
      .sort({ createdAt: sortDirection });

    if (!migrationsToRun.length) {
      this.bffLoggerService.warn('There are no migrations to run');
      this.bffLoggerService.warn(`Current Migrations' Statuses: `);
      await this.list(migrationGroup);
    }

    let numMigrationsRun = 0;
    tsnode.register({ transpileOnly: true } as tsnode.Options);

    for (const migration of migrationsToRun) {
      const migrationFilePath = path.join(
        this.absolutePaths.migrationScriptsRoot,
        migrationGroup,
        migration.filename,
      );
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
        this.bffLoggerService.debug(
          `Update migration table for migration: ${migration.name}`,
        );
        const completed = await this.migrationModel.updateOne(
          { name: migration.name },
          { state: direction },
        );
        this.bffLoggerService.log(
          `migration models updated: ${JSON.stringify(completed)}`,
        );

        // log completed
        this.bffLoggerService.log(
          `${migration.filename} (${direction.toUpperCase()})`,
        );

        numMigrationsRun++;
      } catch (err) {
        this.bffLoggerService.error(
          `Failed to run migration ${migrationFilePath} due to an error.`,
          err.stack,
        );
        this.bffLoggerService.warn(
          `Not continuing. Make sure your data is in consistent state`,
        );
        throw err;
      }
    }

    this.bffLoggerService.log(`Migrations run: ${numMigrationsRun}`);
  }

  /**
   * Looks at the file system migrations and imports any migrations that are
   * on the file system but missing in the database into the database
   *
   * This functionality is opposite of prune()
   */
  public async sync(migrationGroup: string, interactive: boolean) {
    try {
      const { filesNotInDb } = await this.compareFileSystemWithDB(
        migrationGroup,
      );
      let migrationsToImport = filesNotInDb;

      this.bffLoggerService.log(
        'Synchronizing database with file system migrations...',
      );

      if (migrationsToImport.length === 0) {
        this.bffLoggerService.log('There are no migrations to synchronize');
      } else if (interactive) {
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

      const promises: Array<Promise<any>> = new Array();
      for (const migrationToImport of migrationsToImport) {
        promises.push(
          new Promise((resolve, reject) => {
            const {
              filePath,
              migrationName,
              timestamp,
            } = this.getFilenameParts(migrationGroup, migrationToImport);

            this.bffLoggerService.log(
              `Adding migration ${filePath} into database require(file system. State is ` +
                `DOWN`,
            );

            this.migrationModel
              .create({
                name: migrationName,
                createdAt: timestamp,
              })
              .then(createdMigration => {
                this.bffLoggerService.log(
                  `Migration created: ${JSON.stringify(
                    createdMigration.toJSON(),
                  )}`,
                );
                resolve(createdMigration);
              });
          }),
        );

        await Promise.all(promises).catch(reason =>
          this.bffLoggerService.error(
            `Could not synchronize migrations in the migrations folder up to the database`,
            reason,
          ),
        );
      }
    } catch (error) {
      this.bffLoggerService.error(
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
  public async prune(migrationGroup: string, interactive: boolean) {
    try {
      const { dbMigrationsNotOnFs } = await this.compareFileSystemWithDB(
        migrationGroup,
      );
      let migrationsToDelete = dbMigrationsNotOnFs.map(m => m.name);

      if (migrationsToDelete.length === 0) {
        this.bffLoggerService.log('There are no migrations to prune');
      } else if (interactive) {
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
        this.bffLoggerService.log(
          `Removing migration(s) ${migrationsToDelete.join(
            ', ',
          )} from database`,
        );
        await this.migrationModel.remove({
          name: { $in: migrationsToDelete },
        });
      }

      return migrationsToDeleteDocs;
    } catch (error) {
      this.bffLoggerService.error(
        `Could not prune extraneous migrations from database.`,
      );
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
  public async list(migrationGroup: string) {
    const {
      migrationsInDatabase,
      migrationsInFolder,
      filesNotInDb,
      dbMigrationsNotOnFs,
    } = await this.compareFileSystemWithDB(migrationGroup);

    this.bffLoggerService.log(
      `There are ${
        migrationsInDatabase.length
      } migration documents in the database, and ${
        migrationsInFolder.length
      } migration files on the file system.`,
    );

    if (migrationsInDatabase.length > 0) {
      this.bffLoggerService.log('\n');
      this.bffLoggerService.log(
        `The following migrations are in the database:`,
      );
      migrationsInDatabase.map(m => {
        this.bffLoggerService.log(
          `${m.filename} (${m.state === MigrationState.Up ? 'UP:' : 'DOWN'})`,
        );
      });
    }

    if (dbMigrationsNotOnFs.length > 0) {
      this.bffLoggerService.log('\n');
      this.bffLoggerService.log(
        `The following migrations exist in the database, but not the filesystem. (Run the migrations-prune command to remove these from the database): `,
      );
      dbMigrationsNotOnFs.map(m => {
        this.bffLoggerService.log(
          `${m.filename} (${m.state === MigrationState.Up ? 'UP' : 'DOWN'})`,
        );
      });
    }

    if (filesNotInDb.length > 0) {
      this.bffLoggerService.log('\n');
      this.bffLoggerService.log(
        `The following migrations exist on the filesystem, but not the database. (Run the migrations-sync command to add these to the database): `,
      );
      filesNotInDb.map(m => {
        this.bffLoggerService.log(m);
      });
    }
  }

  /**
   *
   */
  private async compareFileSystemWithDB(migrationGroup: string) {
    const filesInMigrationFolder = fs.readdirSync(
      path.join(this.absolutePaths.migrationScriptsRoot, migrationGroup),
    );

    const migrationsInDatabase = await this.migrationModel
      .find({})
      .sort({ createdAt: 1 });

    this.bffLoggerService.debug(
      'compareFileSystemWithDB.migrationsInDatabase',
      migrationsInDatabase,
    );

    const migrationsInFolder = filesInMigrationFolder
      .filter(file => /\d{13,}\-.+.(ts)$/.test(file))
      .map(filename => {
        const fileCreatedAt = +filename.split('-')[0];
        const existsInDatabase = migrationsInDatabase.some(
          m => filename === m.filename,
        );
        return { createdAt: fileCreatedAt, filename, existsInDatabase };
      });

    this.bffLoggerService.debug(
      'compareFileSystemWithDB.migrationsInFolder',
      filesInMigrationFolder,
      migrationsInFolder,
    );

    const filesNotInDb = migrationsInFolder
      .filter(migrationInFolder => migrationInFolder.existsInDatabase === false)
      .map(f => f.filename);
    const dbMigrationsNotOnFs = migrationsInDatabase.filter(migrationInDB => {
      return !migrationsInFolder.find(
        migrationInFolder =>
          migrationInFolder.filename === migrationInDB.filename,
      );
    });
    return {
      migrationsInDatabase,
      migrationsInFolder,
      filesNotInDb,
      dbMigrationsNotOnFs,
    };
  }

  /**
   *
   * @param migrationToImport
   */
  private getFilenameParts(migrationGroup: string, migrationToImport: string) {
    const filePath = path.join(
      this.absolutePaths.migrationScriptsRoot,
      migrationGroup,
      migrationToImport,
    );
    const timestampSeparatorIndex = migrationToImport.indexOf('-');
    const timestamp = migrationToImport.slice(0, timestampSeparatorIndex);
    const migrationName = migrationToImport.slice(
      timestampSeparatorIndex + 1,
      migrationToImport.lastIndexOf('.'),
    );
    return { filePath, migrationName, timestamp };
  }

  /**
   *
   * @param migrationFilePath
   * @param direction
   * @param migrationFilename
   */
  private async getDirectionalMigrationFunction(
    migrationFilePath: string,
    direction: string,
    migrationFilename: string,
  ) {
    let migrationFunctions;

    // tslint:disable-next-line:whitespace
    migrationFunctions = await import(migrationFilePath);

    this.bffLoggerService.debug(migrationFunctions);

    if (!migrationFunctions) {
      this.bffLoggerService.error(
        `The migration file '${migrationFilePath}' could not be loaded.`,
      );
      return null;
    }

    const directionalMigrationFunction = migrationFunctions[direction];
    if (!directionalMigrationFunction) {
      this.bffLoggerService.error(
        `The ${direction} export is not defined in ${migrationFilename}.`,
      );
      return null;
    }
    return directionalMigrationFunction;
  }

  private async runMigrationFunction(directionalMigrationFunction: any) {
    await new Promise((resolve, reject) => {
      const callPromise = directionalMigrationFunction.call(
        null,
        this.migrationModel.collection.conn,
        this.bffLoggerService,
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
