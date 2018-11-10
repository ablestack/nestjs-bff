# Nestjs-BFF

<p align="center">
  <i><a href="README.md">Overview</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="apps/api/README.md">API</a>
  &nbsp;&nbsp;&nbsp;
	<a href="apps/cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<a href="apps/webclient/README.md">Web Client</a>
  &nbsp;&nbsp;&nbsp;
	<a href="devops/README.md">DevOps</a>
</p>

## Overview

NestJS-BFF is a starter project for those looking to fast-track building a strongly typed, enterprise-grade, modern NodeJs application, with supporting tooling.

This is a Mono-repo project containing an [API](apps/api/README.md), companion [CLI](apps/cli/README.md), [Web Client](apps/webclient/README.md), and companion NPM packages. Follow the README navigation links for details on each of these. The core infrastructure is contained in NPM packages, so that projects build using this boilerplate can easily benefit from future updates though a simple NPM update command.

This implementation uses the [BFF](https://samnewman.io/patterns/architectural/bff/) pattern, leveraging [NestJS](https://nestjs.com/) as the primary framework for the backend API. The client-side example is in [Angular](https://angular.io/), although any client-side Javascript framework can easily be used, including [React](https://reactjs.org/), or [Vue](https://vuejs.org/) js.

## Installation & Usage

See the [DevOps](devops/README.md) documentation and folder for instructions and scripts to install, run, and maintain nestjs-bff applications

## Background

[NestJS](https://nestjs.com/) is a fantastic project, and a pleasure to develop with. However, it is a framework by design, and not a complete production-ready web-application solution. Features such as logging, configuration management, data-base migrations, and even authentication need to be learned, assembled, and configured before they can be used.

This project aims to provide an enterprise-ready web-application skeleton, out-of-the-box, and built on top of the nest-js framework.

### Developer Benefits

There are a number of benefits that make NestJs and Angular a very compelling web development stack:

- NestJS and Angular are both versatile and highly compatible frameworks, that provide a great developer experience
- Significant reduction in context-switching between frontend and backend development
  - TypeScript language for both the backend and frontend
  - Strongly type on both the backend and frontend
  - Leverages the Node JavaScript framework for both backend and frontend development
  - Incredibly similar architecture and design patterns
- Backend framework can be leveraged for other execution contexts, including CLI (example included) or even Desktop
- Leverages fully open source technology
- Hosting options are broad, and flexible, with multiple value-options, including broad native cloud hosting support (including Heroku)

# Notes

- The API can run independently from the CLI
- The CLI requires the API to compile and run
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
- [DevOps](devops/README.md)
