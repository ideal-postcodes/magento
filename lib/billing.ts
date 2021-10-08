import {
  Config,
  setupAutocomplete,
  includes,
  setupPostcodeLookup,
} from "./extension";
import {getParent} from "@ideal-postcodes/jsutil";

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
export const parentTest =  (e: HTMLElement) => {
  return e.offsetWidth > 0 && e.offsetHeight > 0;
};

export const getScope = (anchor: HTMLElement) => getParent(anchor, "form")

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest, getScope });
  setupPostcodeLookup(config, selectors, { pageTest, getScope });
};
