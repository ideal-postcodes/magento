import { getParent } from "@ideal-postcodes/jsutil";
import { Config, setupAutocomplete, includes } from "./extension";

export const billing = {
  line_1: '[name="order[billing_address][street][0]"]',
  line_2: '[name="order[billing_address][street][1]"]',
  line_3: '[name="order[billing_address][street][2]"]',
  postcode: '[name="order[billing_address][postcode]"]',
  post_town: '[name="order[billing_address][city]"]',
  organisation_name: '[name="order[billing_address][company]"]',
  county: '[name="order[billing_address][region]"]',
  country: '[name="order[billing_address][country_id]"]',
};

export const shipping = {
  line_1: '[name="order[shipping_address][street][0]"]',
  line_2: '[name="order[shipping_address][street][1]"]',
  line_3: '[name="order[shipping_address][street][2]"]',
  postcode: '[name="order[shipping_address][postcode]"]',
  post_town: '[name="order[shipping_address][city]"]',
  organisation_name: '[name="order[shipping_address][company]"]',
  county: '[name="order[shipping_address][region]"]',
  country: '[name="order[shipping_address][country_id]"]',
};

const selectorList = [billing, shipping];

const parentScope = "fieldset";

export const bind = (config: Config) => {
  selectorList.forEach((selectors) => {
    setupAutocomplete(config, selectors, {
      pageTest,
      getScope: (anchor: HTMLElement) => getParent(anchor, parentScope),
    });
  });
};

const pageTest = () => includes(window.location.pathname, "/sales");
