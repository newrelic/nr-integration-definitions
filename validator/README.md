# Infra integration definitions

This repository contains the integration definition files for all Cloud and Prometheus Infra integrations and validation tools.
More information about spec files could be found in [this document](add link to the schema documentation).

## Validation

The files stored here are automatically validated whenever there is a pull request.

If you want to validate them yourself, before opening a pull request you can do so locally

### Local setup

There are two different ways of running the schema validation locally.

You can run it using `npm`:

- Install [NodeJS](https://nodejs.org/en/)
- Optionally install [NVM](https://github.com/nvm-sh/nvm)
- Clone this repo: `git clone https://github.com/newrelic/nr-integration-definitions`
- Run

```sh
npm --prefix validator install
```

- Run

```sh
npm --prefix validator check
```

You can also run each of the validation tools independently:

```sh
npm  --prefix validator run validate-schema
```

and

```sh
npm  --prefix validator run lint
```

Or if you do not want to install NodeJS you can use the provided Dockerfile, `Dockerfile.validator` to validate the definition files.

- Make sure you have `docker` installed (https://docs.docker.com/get-docker/)
- Build the image:

```sh
docker build . -f Dockerfile.validator -t newrelic/definitions-validator
```

- Run the container:
  
```sh
docker run newrelic/definitions-validator
```
