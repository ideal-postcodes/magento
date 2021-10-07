import {
  Config,
  setupAutocomplete,
  includes,
  setupPostcodeLookup,
} from "./extension";

export const selectors = {
  line_1: '[name="street[0]"]',
  line_2: '[name="street[1]"]',
  line_3: '[name="street[2]"]',
  postcode: '[name="postcode"]',
  post_town: '[name="city"]',
  organisation_name: '[name="company"]',
  county: '[name="region"]',
  country: '[name="country_id"]',
};

export const pageTest = () => includes(window.location.pathname, "/checkout");

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest });
  setupPostcodeLookup(config, selectors, { pageTest });
};
