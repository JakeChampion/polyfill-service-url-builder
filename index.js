#!/usr/bin/env node

"use strict";

require("yargs")
    .usage('$0 command')
    .command('analyse', 'Analyse a JavaScript file and generate a polyfill.io URL based on all the features that are being used from within the JavaScript file.', {
        file: {
            string: true,
            describe: 'The file that should be analysed',
            demandOption: true
        }
    }, async function parseFile(argv) {
        const execa = require('execa');
        const generatePolyfillURL = require('./src/index.js');
        const {
            stdout
        } = await execa('js-features-analyser', ['analyse', '--file', argv.file], {
            preferLocal: true
        });
        console.log(await generatePolyfillURL(JSON.parse(stdout)));
    })
    .help()
    .strict()
    .argv;