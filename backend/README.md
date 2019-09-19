# Nestjs-BFF BACKEND

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

## Backend API Installation and Usage

This project uses Yarn Workspaces and Lerna to install and run multiple sub-repos from a single command. See the <a href="../DEVOPS.md">DevOps</a> README for instructions on how to install and run this application.

View api endpoint at: http://localhost:3000

## API Test

1.  Navigate to /backend, then run the following command:

```bash
# e2e tests
$ yarn run e2e-with-docker
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
