# Nestjs-BFF Web Client

<p align="center">
  <a href="../README.md">Overview</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../api/README.md">API</a>
  &nbsp;&nbsp;&nbsp;
	<a href="../cli/README.md">CLI</a>
  &nbsp;&nbsp;&nbsp;
	<i><a href="README.md">Web Client</a></i>
  &nbsp;&nbsp;&nbsp;
	<a href="../../devops/README.md">DevOps</a>
</p>

## Web Client Overview

The Web Client demonstrates how to integrate with the NextJS BFF API, including:

- **Authentication**
- **REST API Interactions**

## Attribution

This example heavily leverages the [Jason Watmore tutorial on Angular JWT Authentication](http://jasonwatmore.com/post/2018/05/23/angular-6-jwt-authentication-example-tutorial) and the [companion git repo](https://github.com/cornflourblue/angular-6-jwt-authentication-example).

## Web Client Installation

Navigate to the root of Nestjs-Bff repo, the run then following command:

```bash
# install dependencies for all sub projects (api, cli, webclient)
$ yarn install-all
```

Or

Navigate to /webclient, then run the following command:

```bash
# install dependencies
$ yarn install
```

## Web Client Usage

```bash
# go into app's directory
$ cd workspaces/webclient

# serve with hot reload at localhost:4200.
$ npm start

# build for production with minification
$ npm build
```

## Readme Navigation

Further details on each of the systems contained in this project can be found via the following links:

- [Overview](../README.md)
- [API](../api/README.md)
- [CLI](../cli/README.md)
- _[Web Client](README.md)_
- [DevOps](../../devops/README.md)
