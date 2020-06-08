#!/usr/bin/env node

'use strict';

require('yargs')
  .usage('$0 command')
  .command(
    'analyse',
    'Analyse a JavaScript file and generate a polyfill.io URL based on all the features that are being used from within the JavaScript file.',
    {
      file: {
        array: true,
        string: true,
        describe: 'The file that should be analysed',
        demandOption: true,
      },
    },
    async function parseFile(argv) {
      const browserslist = require('browserslist');
      const browsersListConfig = browserslist.loadConfig({
        path: process.cwd(),
      });
      let browsers = [];
      if (browsersListConfig) {
        browsers = browserslist(browsersListConfig);
      }

      const generatePolyfillURL = require('./src/index.js');
      const path = require('path');
      const babel = require('@babel/core');
      const plugin = require('@financial-times/js-features-analyser/src/index.js');
      const fs = require('fs');
      const os = require('os');
      const promisify = require('util').promisify;
      const readFile = promisify(fs.readFile);
      const mkdtemp = promisify(fs.mkdtemp);

      const promiseList = argv.file.map(async filename => {
        const file = path.join(process.cwd(), filename);
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
      const uniqueFeatureList = [...new Set(featureList)];

      const result = await generatePolyfillURL(uniqueFeatureList, browsers);

      if (result.type === generatePolyfillURL.TYPE_URL) {
        console.log(result.message);
      } else if (result.type === generatePolyfillURL.TYPE_NOTHING) {
        console.error(result.message);
      }
    }
  )
  .help()
  .strict().argv;
