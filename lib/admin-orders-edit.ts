import { setupBind } from "@ideal-postcodes/jsutil";

import { Config, setupAutocomplete } from "./extension";

import { selectors } from "./billing";

const bind = (config: Config) => {
  setupBind({ selectors }).forEach(({ targets }) => {
    setupAutocomplete(config, targets);
  });
};

const pageTest = () => window.location.pathname.includes("/sales/order");

export const bindings = { bind, pageTest };
