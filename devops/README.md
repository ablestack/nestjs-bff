# Nestjs-BFF

<p align="center">
  <i><a href="../README.md">Overview</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="../api/README.md">API</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../webclient/README.md">Web Client</a>
  &nbsp;&nbsp;&nbsp;
	<a href="README.md">DevOps</a>
</p>

## Overview

The NestJS-BFF DevOps directory contains scripts, tooling, and documentation designed to automate and simplify the operational aspects of running a NestJS-BFF application.

## Installation

1.  Ensure that NodeJS and Docker are installed on your local machine

2.  Navigate to the devops folder of Nestjs-Bff repo, the run the following command:

```bash
# install dependencies for all sub projects (api, cli, webclient), and a Docker MongoDB image



$ npm run install-all-with-docker



```

## Start

To start the WebClient and API, navigate to the devops folder of Nestjs-Bff repo, the run the following command:

```bash
# run api, webclient, and a Docker hosted MongoDB instance



$ npm run start-all-with-docker



```

## Local Package Development

### Temporary

If you would like to develop and test updates to the companion Nestjs-bff packages, you can run the following commands to create temporary symlinks

```bash
# Initialize the links. Run when pulling a fresh copy of the repo

$ npm run link-initialize

```

```bash
# Creates a symlink to the local companion packages in the consuming node_modules folder. Run each time the links need refreshing

$ npm run link-all

```

### Permanent

If you would like to make permanent custom updates to the companion Nestjs-bff packages, for your Nestjs-BFF application to consume, you can leverage [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) to enable this. Simply update your package.json files to use [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) for any packages in the package directory that you wish to customize. However, please note, this will mean that you will not longer be able to benefit from future published updates to the companion packages.

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [API](../api/README.md)
- [CLI](../cli/README.md)
- [Web Client](../README.md)
- _[DevOps](devops/README.md)_
