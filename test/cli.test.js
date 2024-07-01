/* eslint-env jest */

const {node} = require("tinysh");
const path = require("path");
const cli = path.resolve(__dirname, '../index.js');

test("Analyses the bundle inners and returns the polyfill url", async () => {
  const expected = "https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=DOMTokenList.prototype.forEach,NodeList.prototype.forEach,URLSearchParams";
  const actual = await node(cli, "analyse", "--file", "test/fixtures/array.prototype.foreach.js").trim();

  expect(actual).toEqual(expected);
});

test("Analyses the bundle inners and applies custom options", async () => {
  const expected = "https://cdnjs.cloudflare.com/polyfill/v3/polyfill.min.js?features=DOMTokenList.prototype.forEach,NodeList.prototype.forEach,URLSearchParams&flags=gated,always&use-compute-at-edge-backend=yes&unknown=ignore";
  const actual = await node(
    cli, "analyse",
    "--file", "test/fixtures/array.prototype.foreach.js",
    "--hostname", "cdnjs.cloudflare.com/polyfill",
    "--omit", "Array.prototype.map",
    "--unknown", "ignore",
    "--flags", "gated", "always",
    "--use-compute-at-edge-backend", "yes"
  ).trim();

  expect(actual).toEqual(expected);
});
