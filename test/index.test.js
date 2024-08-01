/* eslint-env jest */

const generatePolyfillURL = require('../src/index');

test('Adds a feature to the features querystring if it exists in polyfill-library', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Promise';
    const actual = await generatePolyfillURL(["Promise"])
    expect(actual.message).toEqual(expected);
});

test('Does not add duplicated features to the features querystring', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Promise';
    const actual = await generatePolyfillURL(["Promise", "Promise"])
    expect(actual.message).toEqual(expected);
});

test('Does not add features to the features querystring which do not exist in polyfill-library', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Promise';
    const actual = await generatePolyfillURL(["Promise", "Carrot"])
    expect(actual.message).toEqual(expected);
});

test('Adds a feature to the features querystring if it exists as an alias of a polyfill from within polyfill-library', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=ArrayBuffer';
    const actual = await generatePolyfillURL(["ArrayBuffer"])
    expect(actual.message).toEqual(expected);
});

test('Adds an alias to the features querystring if it matches multiple features and does not includes polyfill which are not in the features array', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=es2017';
    const actual = await generatePolyfillURL(["Object.entries",
        "Object.getOwnPropertyDescriptors",
        "Object.values",
        "String.prototype.padEnd",
        "String.prototype.padStart"
    ])
    expect(actual.message).toEqual(expected);
});

test('Adds the constructor of a feature to the features querystring if the specific feature does not exist from within polyfill-library', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=DOMTokenList';
    const actual = await generatePolyfillURL([
        "DOMTokenList.prototype.add"
    ]);
    expect(actual.message).toEqual(expected);
});

test('Sorts the features in alphabetical order to make spotting changes when updating the url simpler', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Array.from,DOMTokenList,fetch,String.prototype.padStart,WeakSet';
    const actual = await generatePolyfillURL([
        "String.prototype.padStart",
        "fetch",
        "WeakSet.prototype.delete",
        "DOMTokenList.prototype.add",
        "Array.from"
    ]);
    expect(actual.message).toEqual(expected);
});

test('Accepts a browserlist array', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=Array.from';
    const actual = await generatePolyfillURL([
        "Array.from"
    ], ["op_mini *"]);
    expect(actual.message).toEqual(expected);
});

test('Accepts a custom hostname', async () => {
    const expected = 'https://example.com/polyfill/v3/polyfill.min.js?features=Array.from';
    const actual = await generatePolyfillURL([
        "Array.from"
    ], [], "example.com");
    expect(actual.message).toEqual(expected);
});
