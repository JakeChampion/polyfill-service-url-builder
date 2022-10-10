/* eslint-env jest */

const analyse = require('../src/analyse');
const path = require('path');

test('Adds a feature to the features querystring if it exists in polyfill-library and presents in the fixture', async () => {
    const expected = 'https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach,Array.prototype.map,Map,Set';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
    });
    expect(actual.message).toEqual(expected);
});

test('Adds a feature to the features querystring if it exists in polyfill-library and presents in the fixture and required by opts', async () => {
    const expected = 'https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
        omit: ['Array.prototype.map', 'Set.prototype.forEach', 'Map.prototype.forEach'],
    });
    expect(actual.message).toEqual(expected);
});

test('Accepts a custom hostname', async () => {
    const expected = 'https://example.com/v3/polyfill.min.js?features=Array.prototype.forEach,Array.prototype.map,Map,Set';
    const actual = await analyse({
        cwd: path.resolve(__dirname, './fixtures'),
        file: ['array.prototype.foreach.js'],
        hostname: 'example.com',
    });
    expect(actual.message).toEqual(expected);
});
