import { Config, setupAutocomplete, setupPostcodeLookup } from "./extension";

const pageTest = () => true;

export const bind = (config: Config) => {
    const fields = config.customFields || [];
    fields.forEach((selectors) => {
        setupAutocomplete(config, selectors, {
            pageTest
        });
        setupPostcodeLookup(config, selectors, {
            pageTest
        })
    })
};
