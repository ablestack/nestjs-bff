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

NestJS-BFF is a starter project for those looking to fast-track building a production-grade [BFF](https://samnewman.io/patterns/architectural/bff/) web application with [NestJS](https://nestjs.com/).

This is a Monorepo project containing an API, companion CLI, and Web Client. Follow the README navigation links for details on each of these.

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

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [API](../api/README.md)
- [CLI](../cli/README.md)
- [Web Client](../README.md)
- _[DevOps](devops/README.md)_
