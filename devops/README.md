# Nestjs-BFF

<p align="center">
  <a href="../README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../frontend/README.md">Frontend</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../backend/README.md">Backend</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="README.md">DevOps</a></i>
</p>

## Overview

The NestJS-BFF DevOps directory contains scripts, tooling, and documentation designed to automate and simplify the operational aspects of running a NestJS-BFF application.

## Installation

1.  Ensure that NodeJS and Docker are installed on your local machine

2.  Ensure you have a console installed that can run
    Linux shell commands. [Cmder](http://cmder.net) is an excellent option for Windows machines, and [can be integrated into VS Code](https://github.com/cmderdev/cmder/wiki/Seamless-VS-Code-Integration)

3.  Navigate to the devops folder of Nestjs-Bff repo, the run the following command:

```bash
# install dependencies for all sub projects (backend, cli, frontend), and a Docker MongoDB image
$ npm run install-all-with-docker
```

## Start

To start the Frontend and Backend, navigate to the devops folder of Nestjs-Bff repo, the run the following command:

```bash
# run backend, frontend, and a Docker hosted MongoDB instance
$ npm run start-all-with-docker

```

## Local Package Development

### Temporary

If you would like to develop and test updates to the companion Nestjs-bff packages, you can run the following commands to create symlinks

```bash
# Symlink the packages for local development

$ npm run packages:link
```

### Permanent

If you would like to make permanent custom updates to the companion Nestjs-bff packages, for your Nestjs-BFF application to consume, you can leverage [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) to enable this. Simply update your package.json files to use [NPM local paths](https://docs.npmjs.com/files/package.json#local-paths) for any packages in the package directory that you wish to customize. However, please note, this will mean that you will not longer be able to benefit from future published updates to the companion packages.

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [Frontend](../frontend/README.md)
- [API](../backend/README.md)
- [CLI](../cli/README.md)
- _[DevOps](devops/README.md)_
