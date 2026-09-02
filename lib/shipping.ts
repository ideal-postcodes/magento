import { selectors, pageTest } from "./billing";
import { Config, setupAutocomplete, setupPostcodeLookup } from "./extension";

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest });
  setupPostcodeLookup(config, selectors, { pageTest });
};
