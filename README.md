# Polyfill.io URL Builder

A Node.js command-line application for analysing your JavaScript file and generating a https://polyfill.io URL based on all the features that are being used from within the JavaScript file.

[![NPM version](https://img.shields.io/npm/v/create-polyfill-service-url.svg)](https://www.npmjs.com/package/create-polyfill-service-url)
[![Build status](https://img.shields.io/circleci/build/gh/Financial-Times/polyfill-service-url-builder.svg)](https://circleci.com/gh/Financial-Times/polyfill-service-url-builder)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE.md)

```bash
> npx create-polyfill-service-url analyse --file bundle.js
```


## Table Of Contents

  - [Usage](#usage)
  - [Contributing](#contributing)
  - [Versioning](#versioning)
  - [Publishing](#publishing)
  - [Authors](#authors)
  - [Contact](#contact)
  - [Licence](#licence)


## Usage

This project requires [Node.js] 10.x and [npm]. You can install with:

```bash
> npx create-polyfill-service-url --file bundle.js
```

## Contributing

This module has a full suite of unit tests, and is verified with ESLint. You can use the following commands to check your code before opening a pull request:

```sh
npm test    # verify JavaScript code with ESLint and run the tests
```


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/Financial-Times/polyfill-service-url-builder/tags). 

## Publishing

New versions of the module are published automatically by CI for every commit which lands on the `master` branch.

## Authors

* **Jake Champion** - *Initial work* - [Jake Champion](https://github.com/JakeChampion)

See also the list of [contributors](https://github.com/Financial-Times/polyfill-service-url-builder/contributors) who participated in this project.

## Contact

If you have any questions or comments about this module, or need help using it, please [raise an issue][issues].


## Licence

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


[issues]: https://github.com/Financial-Times/polyfill-service-url-builder/issues
[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/
