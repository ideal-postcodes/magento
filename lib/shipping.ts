import { selectors } from "./billing";
import {
  Config,
  setupAutocomplete,
  includes,
  setupPostcodeLookup,
} from "./extension";

const pageTest = () => includes(window.location.pathname, "/checkout");

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest });
  setupPostcodeLookup(config, selectors, { pageTest });
};
