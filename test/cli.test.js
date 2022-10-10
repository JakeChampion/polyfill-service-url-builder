/* eslint-env jest */

const {node} = require("tinysh");
const path = require("path");
const cli = path.resolve(__dirname, '../index.js');

test("Analyses the bundle inners and returns the polyfill url", async () => {
  const expected = "https://polyfill.io/v3/polyfill.min.js?features=Array.prototype.forEach,Array.prototype.map,Map,Set";
  const actual = await node(cli, "analyse", "--file", "test/fixtures/array.prototype.foreach.js").trim();

  expect(actual).toEqual(expected);
});

test("Analyses the bundle inners and applies custom flags", async () => {
  const expected = "https://example.com/v3/polyfill.min.js?features=Array.prototype.forEach,Map,Set";
  const actual = await node(
    cli, "analyse",
    "--file", "test/fixtures/array.prototype.foreach.js",
    "--hostname", "example.com",
    "--omit", "Array.prototype.map"
  ).trim();

  expect(actual).toEqual(expected);
});
