import { setupBind, Binding } from "@ideal-postcodes/jsutil";
import { selectors } from "./billing";
import {
  Config,
  setupAutocomplete,
  includes,
  setupPostcodeLookup,
  hoistCountry,
} from "./extension";

const bind = (config: Config) => {
  setupBind({ selectors }).forEach(({ targets }) => {
    hoistCountry(config, targets);
    setupAutocomplete(config, targets);
    setupPostcodeLookup(config, targets);
  });
};

const pageTest = () => includes(window.location.pathname, "/checkout");

export const bindings: Binding = { bind, pageTest };
