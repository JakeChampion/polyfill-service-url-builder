"use strict";

module.exports = async function parseFile(argv) {
  const cwd = argv.cwd || process.cwd();
  const omitList = argv.omit || [];
  const hostname = argv.hostname;
  const browserslist = require('browserslist');
  const browsersListConfig = browserslist.loadConfig({
    path: cwd,
  });
  let browsers = [];
  if (browsersListConfig) {
    browsers = browserslist(browsersListConfig);
  }

  const generatePolyfillURL = require('./index.js');
  const path = require('path');
  const babel = require('@babel/core');
  const plugin = require('@financial-times/js-features-analyser/src/index.js');
  const fs = require('fs');
  const os = require('os');
  const promisify = require('util').promisify;
  const readFile = promisify(fs.readFile);
  const mkdtemp = promisify(fs.mkdtemp);

  const promiseList = argv.file.map(async filename => {
    const file = path.join(cwd, filename);
    const fileContents = await readFile(file, 'utf-8');
    const tempFolder = await mkdtemp(
      path.join(os.tmpdir(), 'js-features-analyser')
    );
    const outputDestination = path.join(tempFolder, 'features.json');

    try {
      babel.transformSync(fileContents, {
        plugins: [
          [
            plugin,
            {
              outputDestination,
            },
          ],
        ],
        filename: file,
        ast: false,
        code: false,
      });

      return JSON.parse(fs.readFileSync(outputDestination, 'utf-8'));
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(
          'Failed to parse the JavaScript from xxx because it has a syntax error.'
        );
        delete error.stack;
        delete error.code;
        delete error.pos;
        delete error.loc;
        const result = /: (?<errorType>[\w ]+) \((?<position>\d+:\d+)\)/.exec(
          error.message
        );
        console.error(result.groups.errorType);
        error.message = error.message.replace(
          ` ${result.groups.errorType} `,
          ''
        );
        error.message = error.message.replace(
          `(${result.groups.position})`,
          result.groups.position
        );
        console.error(error.message);
      } else {
        console.error(
          'Failed to parse the JavaScript from xxx because an error occured:'
        );
        console.error(error);
      }
    }
  });

  const resultList = await Promise.all(promiseList);
  const featureList = resultList.reduce(
    (carry, item) => [...carry, ...item],
    []
  );
  const filteredFeatureList = featureList.filter((feat) => !omitList.includes(feat))
  const uniqueFeatureList = [...new Set(filteredFeatureList)];

  const result = await generatePolyfillURL(uniqueFeatureList, browsers, hostname);

  if (result.type === generatePolyfillURL.TYPE_URL) {
    console.log(result.message);
  } else if (result.type === generatePolyfillURL.TYPE_NOTHING) {
    console.error(result.message);
  }

  return result;
};
