/* eslint-env jest */

const analyse = require('../src/analyse');
const path = require('path');

test('Adds a feature to the features querystring if it exists in polyfill-library and presents in the fixture', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=DOMTokenList.prototype.forEach,NodeList.prototype.forEach,URLSearchParams';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
    });
    expect(actual.message).toEqual(expected);
});

test('Adds a feature to the features querystring if it exists in polyfill-library and presents in the fixture and required by opts', async () => {
    const expected = 'https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=DOMTokenList.prototype.forEach,NodeList.prototype.forEach,URLSearchParams';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
        omit: ['Array.prototype.map', 'Set.prototype.forEach', 'Map.prototype.forEach'],
    });
    expect(actual.message).toEqual(expected);
});

test('Accepts custom params', async () => {
    const expected = 'https://example.com/polyfill/v3/polyfill.min.js?features=DOMTokenList.prototype.forEach,NodeList.prototype.forEach,URLSearchParams&flags=gated,always&use-compute-at-edge-backend=yes&unknown=polyfill';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
        hostname: 'example.com',
        unknown: 'polyfill',
        useComputeAtEdgeBackend: 'yes',
        flags: ['gated', 'always'],
    });
    expect(actual.message).toEqual(expected);
});
