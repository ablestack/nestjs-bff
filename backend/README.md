# Nestjs-BFF API

<p align="center">
  <a href="../../README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../frontend/README.md">Frontend</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="README.md">Backend</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="../cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../DEVOPS.md">DevOps</a>
</p>

## API Overview

Based on the standard Nest CLI generated API, with the following customizations and enhancements:

- **JWT Authentication**
- **Roles base Authorization**
- **MongoDB Migration System**: A NestJS based Mongo migrations system. Uses DB to track migration state. As such works well in cloud and container environment where local file-based state is not guaranteed across deployments
- **Logger Service**: Production grade Logger, leveraging Winston
- **Configuration Service**: Strongly typed production-grade configuration system. Centralizes configuration and leverages both .env and fast and flexible ts object literal based configuration
- **e2e Testing**: e2e testing of controllers and services, including exercising of authentication and authorization

## Backend Installation

1.  Navigate to the root folder, the run then following command:

```bash
# install dependencies for all sub projects (backend, cli, frontend)
$ yarn run install-all
```

Or

1.  Navigate to /backend, then run the following command:

```bash
# install dependencies for backend only
$ yarn install
```

## API Configuration

Various self-explanatory configuration options are available via the config folder:

- use the .env file for environment specific and sensitive configuration items
- use the .ts files for all other configuration needs

## API Usage

1.  Navigate to /backend, then run the following command:

```bash
# development
$ yarn start
```

View at: http://localhost:3000

## API Test

1.  Navigate to /backend, then run the following command:

```bash
# e2e tests
$ yarn e2e-with-docker
```

<!---
    Not avaialable yet:
    # unit tests
    $ yarn run test

    # test coverage
    $ yarn run test:cov
--->

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [Frontend](../frontend/README.md)
- _[Backend](README.md)_
- [CLI](../cli/README.md)
- [DevOps](../DEVOPS.md)
