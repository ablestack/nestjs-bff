# Nestjs-BFF DEVOPS

<p align="center">
  <a href="README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<a href="frontend/README.md">Frontend</a>
  &nbsp;&nbsp;&nbsp;
	<a href="backend/README.md">Backend</a>
  &nbsp;&nbsp;&nbsp;
	<a href="cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="DEVOPS.md">DevOps</a></i>
</p>

## Overview

The NestJS-BFF root folder contains scripts, tooling, and documentation designed to automate and simplify the operational aspects of running a NestJS-BFF application.

## Installation

1.  Ensure that NodeJS, Docker, and Lerna are installed on your local machine

2.  Ensure you have a console installed that can run
    Linux shell commands. Mac can do this natively, and [Cmder](http://cmder.net) is an excellent option for Windows machines(and [can be integrated into VS Code](https://github.com/cmderdev/cmder/wiki/Seamless-VS-Code-Integration))

3.  Navigate to the root folder of Nestjs-Bff repo, the run the following command:

```bash
# installs dependencies for all projects, symlinks local dependencies, and compiles the typescript
$ yarn bootstrap

```

## Start

To start the Frontend and Backend, navigate to the root folder of Nestjs-Bff repo, the run the following command:

```bash
# run backend, frontend, and a Docker hosted MongoDB instance
$ yarn start-with-docker

# if you wish to use a local installation of MongoDB instead of docker, you can use the following command instead
$ yarn start


```

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](README.md)
- [Frontend](frontend/README.md)
- [API](backend/README.md)
- [CLI](cli/README.md)
- _[DevOps](DEVOPS.md)_
