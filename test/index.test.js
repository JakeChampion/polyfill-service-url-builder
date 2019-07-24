/* eslint-env jest */

const generatePolyfillURL = require('../src/index');

test('Adds a feature to the features querystring if it exists in polyfill-library', async () => {
    const expected = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach';
    const actual = await generatePolyfillURL(["Array.prototype.forEach"])
    expect(actual).toEqual(expected);
});

test('Does not add duplicated features to the features querystring', async () => {
    const expected = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach';
    const actual = await generatePolyfillURL(["Array.prototype.forEach", "Array.prototype.forEach"])
    expect(actual).toEqual(expected);
});

test('Does not add features to the features querystring which do not exist in polyfill-library', async () => {
    const expected = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach';
    const actual = await generatePolyfillURL(["Array.prototype.forEach", "Carrot"])
    expect(actual).toEqual(expected);
});

test('Adds a feature to the features querystring if it exists as an alias of a polyfill from within polyfill-library', async () => {
    const expected = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=ArrayBuffer';
    const actual = await generatePolyfillURL(["ArrayBuffer"])
    expect(actual).toEqual(expected);
});

test('Adds an alias to the features querystring if it matches multiple features and does not includes polyfill which are not in the features array', async () => {
    const expected = 'https://cdn.polyfill.io/v3/polyfill.min.js?features=es2017';
    const actual = await generatePolyfillURL(["Object.entries",
        "Object.getOwnPropertyDescriptors",
        "Object.values",
        "String.prototype.padEnd",
        "String.prototype.padStart"
    ])
    expect(actual).toEqual(expected);
});

