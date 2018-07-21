# Nestjs-BFF API

<p align="center">
  <a href="../../README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="README.md">API</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="../cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../webclient/README.md">Web Client</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../../devops/README.md">DevOps</a>
</p>

## API Overview

Based on the standard Nest CLI generated API, with the following customizations and enhancements:

- **JWT Authentication**
- **Roles base Authorization**
- **MongoDB Migration System**: A NestJS based Mongo migrations system. Uses DB to track migration state. As such works well in cloud and container environment where local file-based state is not guaranteed across deployments
- **Logger Service**: Production grade Logger, leveraging Winston
- **Configuration Service**: Strongly typed production-grade configuration system. Centralizes configuration and leverages both .env and fast and flexible ts object literal based configuration
- **e2e Testing**: e2e testing of controllers and services, including exercising of authentication and authorization

## API Installation

1.  Navigate to the root of Nestjs-Bff repo, the run then following command:

```bash
# install dependencies for all sub projects (api, cli, webclient)
$ yarn install-all
```

Or

1.  Navigate to /api, then run the following command:

```bash
$ yarn install
```

Then

2.  Rename the file /api/config/.env.example to /api/config/.env

3.  Update configuration settings to suit environment (see Configuration section below)

## API Configuration

Various self-explanatory configuration options are available via the config folder:

- use the .env file for environment specific and sensitive configuration items
- use the .ts files for all other configuration needs

## API Usage

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

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- _[API](README.md)_
- [CLI](../cli/README.md)
- [Web Client](../webclient/README.md)
- [DevOps](../../devops/README.md)
