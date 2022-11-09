# ZRAuth

## Introduction

ZRAuth is a simple multitenant authentication server written in nest js and prisma

-----
## Prisma and DBW
Create a postgres instance and create a db "zrauth"

```
$ npx prisma migrate
```

-----

## Installation

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## License

ZRAuth is [MIT licensed](LICENSE) open source project built on top of NestJS and Prisma.
