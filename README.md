# Sitemap Tester

This Node.js tool helps you make sure that your site's sitemap doesn't contain broken links or links with a different domain.

## Prerequisites

This project requires NodeJS (version 18 or later) and NPM.
[Node](http://nodejs.org/) and [NPM](https://npmjs.org/) are really easy to install.
To make sure you have them available on your machine,
try running the following command.

```sh
$ npm -v && node -v
```
Output
```
8.9.1
v18.9.0
```

## Getting Started

These instructions will get you a copy of the project up and running on your local machine

## Installation

**BEFORE YOU INSTALL:** please read the [prerequisites](#prerequisites)

Start with cloning this repo on your local machine:

```sh
$ git clone https://github.com/MiNiCo88/sitemap-checker.git
$ cd sitemap-tester
```

To install and set up the library, run:

```sh
$ npm install
```

Or if you prefer using Yarn:

```sh
$ yarn
```
## Usage

### Commander output with available options
```
Usage: node sitemap-tester -t https://example.com [OPTIONS]...

Options:
  -v, --version           output the version number
  -t, --target <value>    target url https://example.com
  -u, --user <value>      basic auth user (default: "")
  -p, --password <value>  basic auth password (default: "")
  -s, --skip <value>      skip first n links (default: "0")
  -l, --limit <value>     limit to n links (default: "0")
  -d, --no_domain_check   exclude same domain check
  -c, --no_link_check     exclude link check
  -h, --help              display help for command
```
