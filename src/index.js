"use strict";

const polyfillLibrary = require("polyfill-library");
const UA = require("@financial-times/polyfill-useragent-normaliser");
const semver = require("semver");
/*
[
  'android',     'bb',
  'chrome',      'edge',
  'edge_mob',    'firefox',
  'firefox_mob', 'ie',
  'ie_mob',      'ios_chr',
  'ios_saf',     'op_mini',
  'op_mob',      'opera',
  'safari',      'samsung_mob'
]
*/
const browserBaselines = UA.getBaselines();

/*
[
  'and_chr', 'and_ff',  'and_qq',
  'and_uc',  'android', 'baidu',
  'bb',      'chrome',  'edge',
  'firefox', 'ie',      'ie_mob',
  'ios_saf', 'kaios',   'node',
  'op_mini', 'op_mob',  'opera',
  'safari',  'samsung'
]
*/

function normaliseBrowsers(browsers) {
  return Array.from(
    new Set(
      browsers.map(b => {
        let [name, range] = b.split(" ");
        switch (name) {
          case "and_chr": {
            name = "chrome";
            break;
          }
          case "and_ff": {
            name = "firefox_mob";
            break;
          }
          case "samsung": {
            name = "samsung_mob";
            break;
          }
        }
        return name + " " + semver.coerce(range, { loose: true }).toString();
      })
    ),
    a => a.split(" ")
  );
}
async function generatePolyfillURL(features = [], supportedBrowsers = []) {
  if (supportedBrowsers) {
    supportedBrowsers = normaliseBrowsers(supportedBrowsers);
  }
  const polyfillUrl = "https://cdn.polyfill.io/v3/polyfill.min.js";
  const aliases = await polyfillLibrary.listAliases();
  const polyfills = await polyfillLibrary.listAllPolyfills();
  const featuresInPolyfillLibrary = new Set();

  for (const feature of features) {
    if (polyfills.includes(feature)) {
      featuresInPolyfillLibrary.add(feature);
    } else if (feature in aliases) {
      featuresInPolyfillLibrary.add(feature);
    } else if (feature.includes(".prototype")) {
      const featureConstructor = feature.split(".prototype")[0];
      if (polyfills.includes(featureConstructor)) {
        featuresInPolyfillLibrary.add(featureConstructor);
      } else if (featureConstructor in aliases) {
        featuresInPolyfillLibrary.add(featureConstructor);
      }
    }
  }

  for (const [alias, polyfills] of Object.entries(aliases)) {
    if (polyfills.length > 2) {
      const allPolyfillsInAliasAreInFeatures = polyfills.every(polyfill =>
        featuresInPolyfillLibrary.has(polyfill)
      );
      if (allPolyfillsInAliasAreInFeatures) {
        featuresInPolyfillLibrary.add(alias);
        polyfills.forEach(polyfill =>
          featuresInPolyfillLibrary.delete(polyfill)
        );
      }
    }
  }

  if (supportedBrowsers.length > 0) {
    for (const feature of featuresInPolyfillLibrary) {
      const featureConfig = await polyfillLibrary.describePolyfill(feature);
      const browsersWithoutFeature = featureConfig.browsers;
      const allSupportedBrowsersSupportFeatureNatively = supportedBrowsers.every(
        ([name, version]) => {
          if (name in browsersWithoutFeature) {
            const browserRangeWithoutFeature = browsersWithoutFeature[name];
            if (semver.satisfies(version, browserRangeWithoutFeature)) {
              console.log(
                name,
                version.toString(),
                "does not support",
                feature
              );
              return false;
            } else {
              console.log(name, version.toString(), "supports", feature);
              return true;
            }
          } else {
            if (name in browserBaselines) {
              console.log(name, version.toString(), "supports", feature);
              return true;
            } else {
              console.log(
                "we do not know if",
                name,
                version.toString(),
                "supports",
                feature
              );
              return false;
            }
          }
        }
      );

      if (allSupportedBrowsersSupportFeatureNatively) {
        featuresInPolyfillLibrary.delete(feature);
      }
    }
  }
  // Sort array of strings alphabetically
  const sortedFeatures = Array.from(featuresInPolyfillLibrary).sort(function(
    a,
    b
  ) {
    return a.localeCompare(b);
  });

  if (sortedFeatures.length === 0) {
    return "You do not need to use polyfill.io as all your supported browsers support all the features your website currently uses.";
  } else {
    return `${polyfillUrl}?features=${sortedFeatures.join(",")}`;
  }
}

module.exports = generatePolyfillURL;
