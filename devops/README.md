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

If you would like to make custom updates to code in the packages folder, for your Nestjs-BFF application to consume, you can leverage [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) to enable this.
Simply update your package.json files to use [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) for any packages in the package directory that you wish to customize.

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [API](../api/README.md)
- [CLI](../cli/README.md)
- [Web Client](../README.md)
- _[DevOps](devops/README.md)_
