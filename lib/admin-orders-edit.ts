import { setupBind } from "@ideal-postcodes/jsutil";
import { Config, setupAutocomplete, includes } from "./extension";
import { selectors } from "./billing";
export { selectors };

const bind = (config: Config) => {
  setupBind({ selectors }).forEach(({ targets }) => {
    setupAutocomplete(config, targets);
  });
};

const pageTest = () => includes(window.location.pathname, "/sales/order");

export const bindings = { bind, pageTest };
