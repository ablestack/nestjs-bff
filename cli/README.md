# Nestjs-BFF CLI

<p align="center">
  <a href="../README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../api/README.md">API</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="../cli/README.md">CLI</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="README.md">Client</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../devops/README.md">DevOps</a>
</p>

## CLI Overview

The CLI is structured to allow the API NestJS API services to be easily exposed and executed via command line. This prevents having to maintain a separate Business Logic codebase for a CLI system - and enables CLI driven development... a surprisingly fast and good development experience.

The primary set of services that are currently exposed via the CLI are for database migrations. However, it is trivial to add commands to expose additional services.

- **Initiate MongoDB Migrations**
- **Initiate customDB scripts - useful for e2e test DB seeding**

## CLI Commands

- **migration-create**: creates a migration file
- **migrations sync**: adds migrations to the DB that exist on the filesystem but not in the DB
- **migrations-list**: lists available migrations from DB and File system
- **migration-up**: runs migrations, up to and including the specified migration
- **migration-down**: rolls-back migrations up to and including the specified migration
- **migrations-prune**: removed migrations from the DB that don't exist on the file system
- **migration-custom**: runs a custom migration script form the filesystem, without checking against the db-migrations table. Useful for seeding databases in e2e test scenarios

## CLI Installation

1.  Navigate to the root of Nestjs-Bff repo, the run then following command:

```bash
# install dependencies for all sub projects (api, cli, webclient)



$ npm run install-all



```

1.  Make a symlink to the CLI from the CLI root directory

```bash
# Windows



$ mklink cli.ts src\cli.ts







# Linux



$ <TODO>



```

3.  Install ts-node globally

```bash
# Windows



$ npm install -g ts-node



```

## CLI Configuration

As the CLI simply initiates the API calls from the command line, the majority of the configuration resides with the API. See API Configuration section above. This may get split out at a later point as more CLI functionality is added.

## CLI Usage

```bash
# Run cli



$ ts-node cli --help



```

### CLI Migrations

The majority of the migrations functionality is based on a port of [mongoose-migrate](https://github.com/balmasi/migrate-mongoose), tailored for a NestJS solution, converted to TypeScript, and decomposed into a command pattern using Yargs.

```bash
# Migration Create



$ ts-node cli migration-create <migration-name>







# Migration Sync (to DB)



$ ts-node cli migrations-sync







# Migration List



$ ts-node cli migrations-list







# Migration Run



$ ts-node cli migrations-up <migration-name>







# Migration Rollback



$ ts-node cli migrations-down <migration-name>







# Migration Prune



$ ts-node cli migrations-prune







# Run custom migration script



$ ts-node cli migration-custom --filename <filename> --direction [up|down]



```

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [API](../api/README.md)
- _[CLI](README.md)_
- [Web Client](../webclient/README.md)
- [DevOps](../devops/README.md)
