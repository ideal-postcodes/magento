import { setupBind } from "@ideal-postcodes/jsutil";

import {
  Config,
  setupAutocomplete,
  setupPostcodeLookup,
  hoistCountry
} from "./extension";

const selectors = {
  line_1: '[name="street[0]"]',
  line_2: '[name="street[1]"]',
  line_3: '[name="street[2]"]',
  postcode: '[name="postcode"]',
  post_town: '[name="city"]',
  organisation: '[name="company"]',
  county: '[name="region"]',
  country: '[name="country_id"]'
};

const bind = (config: Config) => {
  setupBind({
    selectors,
    parentScope: "div",
    parentTest: e => e.classList.contains("billing-address-form")
  }).forEach(({ targets }) => {
    hoistCountry(config, targets);
    setupAutocomplete(config, targets);
    setupPostcodeLookup(config, targets);
  });
};

const pageTest = () => true;

export const bindings = { bind, pageTest };
