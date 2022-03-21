import { selectors, linesIdentifier } from "./multishipping";
import {
  Config,
  includes,
  setupAutocomplete,
  setupPostcodeLookup,
} from "./extension";

const pageTest = () => includes(window.location.pathname, "/customer/address");

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest });
  setupPostcodeLookup(config, selectors, { pageTest }, linesIdentifier);
};
