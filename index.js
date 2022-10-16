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
      },
      cwd: {
        string: true,
        describe: 'The current working directory. Defaults to process.cwd()',
      },
      hostname: {
        string: true,
        describe: 'The hostname to use for the generated URL. Defaults to polyfill.io',
      },
      useComputeAtEdgeBackend: {
        string: true,
        describe: 'Defines the compute-at-edge-backend usage policy: `yes` or `no`. If empty the server will decide.',
      },
      flags: {
        array: true,
        string: true,
        describe: 'Configuration settings for every polyfill being requested. Possible values are `always` and `gated` or both',
      },
      unknown: {
        string: true,
        describe: 'Defines the policy for unsupported browsers: `polyfill` or `ignore`. Defaults to `polyfill`',
      },
    },
    require('./src/analyse')
  )
  .help()
  .strict().argv;
