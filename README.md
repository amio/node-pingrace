# pingrace [![npm version](https://img.shields.io/npm/v/pingrace.svg)](https://www.npmjs.com/package/pingrace)
Ping hosts to compare which one is faster, A Ping Race Program.

<img width="580" alt="pingrace screenshot" src="https://cloud.githubusercontent.com/assets/215282/15285309/e194382a-1b88-11e6-9371-0817a0b2e7ba.png">

> NOTE: Mac & Linux only.

### Install
```
npm install -g pingrace
```

### Usage

```
Usage
  $ pingrace <host> [<host>...]

Options
  -c, --count  Ping every host a specific number of times (default: 10)

Examples
  $ pingrace a.example.com b.example.com c.example.com
  $ pingrace -c 10 a.example.com b.example.com c.example.com
```
