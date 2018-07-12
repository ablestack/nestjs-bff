# Nestjs-BFF

## Description

NestJS-BFF is a starter project for those looking for a fast-track to building a production-grade web-application with a NestJS backend, and a fully client-side JavaScript frontend.

The contained API and CLI works well with any client side JavaScript framework. This provided example web client uses Angular, which is is particularly well suited. This is due to the use of the same strongly typed primary language (TypeScript), and extremely similar architecture and design patterns (Servces, Providers, Modules, DI, etc)

This project leverages Yarn Workspaces to allow for a Monorepo setup, containing an API, CLI, and example client webapp.

### Developer Benefits of NestJS-BFF with an Angular Frontend

- NestJS and Angular are both versatile and highly compatible frameworks, that provide a great developer experience
- Significant reduction in context-switching between frontend and backend development
  - TypeScript language for both the backend and frontend
  - Strongly type on both the backend and frontend
  - Leverages the Node JavaScript framework for both backend and frontend development
  - Incredibly similar architecture and design patterns
- Backend framework can be leveraged for other execution contexts, including CLI (example included) or even DeskTop
- Leverages fully open source technology
- Hosting options are broad, and flexible, with multiple value-options, including broad native cloud hosting support (including Heroku)

## Overview

- Production grade Logging (with Winston)
- Production grade authorization & authentication (with JWT and Bearer tokens)
- Highly structured but flexible configuration system, leveraging strongly typed JSON files, with .env file for environment specific & sensitive data
- MongoDB Database migrations with a custom migrations solution
- End-to-end testing with JEST
- Easily extensible companion CLI, which supports execution of DB Migrations
- Example integration with Angular client WebApp

The majority of this code is a crafted compilation of the great work of some real craftsman out there - not least Kamil Myśliwiec and team who made NestJS. However, setting up an initial production-ready NestJS BFF project has proved to still take a significant amount of time and effort. This work is being shared so that others can benefit from this... and also help make it better!

## API Description

Based on the standard Nest CLI generated API, with the following customizations and enhancements:

- **JWT Authentication**
- **Roles base Authorization**
- **MongoDB Migration System**: A NestJS based Mongo migrations system. Uses DB to track migration state. As such works well in cloud and container environment where local file-based state is not guaranteed across deployments
- **Logger Service**: Production grade Logger, leveraging Winston
- **Configuration Service**: Strongly typed production-grade configuration system. Centralizes configuration and leverages both .env and fast and flexible ts object literal based configuration
- **e2e Testing**: e2e testing of controllers and services, including exercising of authentication and authorization

## CLI Description

The CLI is structured to allow the API NestJS API services to be easily exposed and executed via command line. This prevents having to maintain a separate Business Logic codebase for a CLI system - and enables CLI driven development... a surprisingly fast and good development experience.

The primary set of services that are currently exposed via the CLI are for database migrations. However, it is trivial to add commands to expose additional services.

- **Initiate MongoDB Migrations**
- **Initiate customDB scripts - useful for e2e test DB seeding**

## Example WebApp Client Description

Demonstrates how to integrate with the NextJS BFF, including:

- **Authentication**
- **REST API Interactions**

## API Installation

```bash
$ yarn install
```

## API Configuration

Various self-explanatory configuration options are available via the config folder:

- use the .env file for environment specific and sensitive configuration items
- use the .ts files for all other configuration needs

## API Run

```bash
# development
$ npm run start-bff-api
```

View at: http://localhost:3000

## API Test

```bash
# e2e tests
$ npm run test-bff-api:e2e
```

<!---
    Not avaialable yet:
    # unit tests
    $ npm run test

    # test coverage
    $ npm run test:cov
--->

## CLI Installation

1.  Make a symlink to the CLI in the tools directory

```bash
# Windows
$ mklink cli.ts workspaces\cli\src\cli.ts

# Linux
$ <TODO>
```

2.  Install ts-node globally

```bash
# Windows
$ npm install -g ts-node
```

## CLI Configuration

As the CLI simply initiates the API calls from the command line, the majority of the configuraiton resides with the API. See API Configuration section above. This may get split out at a later point as more CLI functionality is added.

## CLI Commands

- **migration-create**: creates a migration file
- **migrations sync**: adds migrations to the DB that exist on the filesystem but not in the DB
- **migrations-list**: lists available migrations from DB and File system
- **migration-up**: runs migrations, up to and including the specified migration
- **migration-down**: rolls-back migrations up to and including the specified migration
- **migrations-prune**: removed migrations from the DB that don't exist on the file system
- **migration-custom**: runs a custom migration script form the filesystem, without checking against the db-migrations table. Useful for seeding databases in e2e test scenarios

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

# TODO

## Wish List

The following functionality remains to be implemented for a solid v1.0 candidate:

- Users: A Users service, with associated models, controller, and CRUD capabilities

# Contributions

Contributions are not only welcome, but encouraged. Please help make this better! See the [Contributions Guide](CONTRIBUTIONS.md) for details.

# Attributions

See the [Attributions](attributions/ATTRIBUTIONS.md) section.
