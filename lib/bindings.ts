import { setupBind, Binding, Selectors, Config } from "@ideal-postcodes/jsutil";

const selectors: Selectors = {
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
    parentScope: "fieldset",
    parentTest: e => e.classList.contains("address")
  }).forEach(({ anchor, targets, parent }) => {
    if (config.postcodeLookup) {
    }
    if (config.autocomplete) {
    }
  });
};

const pageTest = () => true;

export const bindings: Binding[] = [{ bind, pageTest }];
