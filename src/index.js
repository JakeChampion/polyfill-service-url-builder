"use strict";

const polyfillLibrary = require("polyfill-library");

async function generatePolyfillURL(features = []) {
    const polyfillUrl = 'https://cdn.polyfill.io/v3/polyfill.min.js';
    const aliases = await polyfillLibrary.listAliases();
    const polyfills = await polyfillLibrary.listAllPolyfills();
    const featuresInPolyfillLibrary = new Set;

    for (const feature of features) {
        if (polyfills.includes(feature)) {
            featuresInPolyfillLibrary.add(feature);
        } else if (feature in aliases) {
            featuresInPolyfillLibrary.add(feature);
        } else if (feature.includes('.prototype')) {
            const featureConstructor = feature.split('.prototype')[0];
            if (polyfills.includes(featureConstructor)) {
                featuresInPolyfillLibrary.add(featureConstructor);
            } else if (featureConstructor in aliases) {
                featuresInPolyfillLibrary.add(featureConstructor);
            }
        }
    }

    for (const [alias, polyfills] of Object.entries(aliases)) {
        if (polyfills.length > 2) {
            const allPolyfillsInAliasAreInFeatures = polyfills.every(polyfill => featuresInPolyfillLibrary.has(polyfill));
            if (allPolyfillsInAliasAreInFeatures) {
                featuresInPolyfillLibrary.add(alias);
                polyfills.forEach(polyfill => featuresInPolyfillLibrary.delete(polyfill));
            }
        }
    }

    return `${polyfillUrl}?features=${Array.from(featuresInPolyfillLibrary).join(',')}`;
}

module.exports = generatePolyfillURL