import { Config, setupAutocomplete, includes } from "./extension";
import { selectors } from "./billing";
export { selectors };

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest });
};

const pageTest = () => includes(window.location.pathname, "/sales/order");
