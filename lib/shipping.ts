import { setupBind, Binding } from "@ideal-postcodes/jsutil";
import { selectors } from "./billing";

import {
  Config,
  setupAutocomplete,
  setupPostcodeLookup,
  hoistCountry
} from "./extension";

const bind = (config: Config) => {
  setupBind({ selectors }).forEach(({ targets }) => {
    hoistCountry(config, targets);
    setupAutocomplete(config, targets);
    setupPostcodeLookup(config, targets);
  });
};

const pageTest = () => window.location.pathname.includes("/checkout");

export const bindings: Binding = { bind, pageTest };
