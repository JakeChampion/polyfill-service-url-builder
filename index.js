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
      omit: {
        array: true,
        string: true,
        describe: 'The list of features to omit',
      }
    },
    require('./src/parse')
  )
  .help()
  .strict().argv;
