# Nestjs-BFF

<p align="center">
  <i><a href="README.md">Overview</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="api/README.md">API</a>
  &nbsp;&nbsp;&nbsp;
	<a href="cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<a href="webclient/README.md">Web Client</a>
</p>

## Overview

NestJS-BFF is a starter project for those looking to fast-track building a production-grade [BFF](https://samnewman.io/patterns/architectural/bff/) web application with [NestJS](https://nestjs.com/).

This is a Monorepo project containing an API, companion CLI, and Web Client. Follow the README navigation links for details on each of these.

## Installation

Navigate to the root of Nestjs-Bff repo, the run the following command:

```bash
# install dependencies for all sub projects (api, cli, webclient)
$ yarn install-all
```

## Background

[NestJS](https://nestjs.com/) is a fantastic project, and a pleasure to develop with. However, it is a framework by design, and not an turnkey web application solution. While this makes it a powerful and flexible toolkit for building web-apps, there are quite a few features missing that are often taken for granted in other web-application systems.

Features such as logging, configuration management, data-base migrations, and even authentication are either missing from a newly scaffolded nest-js web-application, or not production quality. To create an enterprise-ready web-application base with nest-js is a worthwhile endeavor, but can be very time consuming. This project aims to provide a short-cut for those who wish to save themselves some time, and an example of a hardened nest-js web-application implementation for the rest of us.

### Developer Benefits

There are a number of benefits that make NestJs and Angular a very compelling web development stack:

- NestJS and Angular are both versatile and highly compatible frameworks, that provide a great developer experience
- Significant reduction in context-switching between frontend and backend development
  - TypeScript language for both the backend and frontend
  - Strongly type on both the backend and frontend
  - Leverages the Node JavaScript framework for both backend and frontend development
  - Incredibly similar architecture and design patterns
- Backend framework can be leveraged for other execution contexts, including CLI (example included) or even DeskTop
- Leverages fully open source technology
- Hosting options are broad, and flexible, with multiple value-options, including broad native cloud hosting support (including Heroku)

# Notes

- The API can run independently from the CLI
- The CLI requires the API to compile and run, and is connected by Yarn Workspaces
- The webclient can run independently, but requires the API to be running to complete API requests, including for authentication

# Contributions

Contributions are not only welcome, but encouraged. Please help make this better! See the [Contributions Guide](CONTRIBUTIONS.md) for details.

# Attributions

See the [Attributions](attributions/ATTRIBUTIONS.md) section.

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- _[Overview](README.md)_
- [API](api/README.md)
- [CLI](cli/README.md)
- [Web Client](webclient/README.md)
