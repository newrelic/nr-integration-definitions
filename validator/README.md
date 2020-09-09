# Infra integration definitions validator

This folder contains a tool that validates integration definition files for all Cloud and Prometheus Infra integrations.

More information about integration definition files can be found in [definition files format](../format.md).

## Validation

Validation of the definition files includes 2 steps:

- schema validation: checks for structural errors in the files like missing required properties or invalid values for some of the properties
- linting: checks duplication of values for entity and metric names (inside a single file)

Validation is automatically run whenever there is a pull request.

If you want to perform validation manually, for example for a newly created file before opening a pull request, just put the file in the `definitions` folder  and run the validation locally like explained [here](#local-setup).

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
docker run -v $PWD/definitions:/opt/local/newrelic/definitions newrelic/definitions-validator
```

The tool expects all integration definition files to be in a folder called `definitions` at the same level of the tool folder and so we need to map the local `definitions` folder inside the container.
