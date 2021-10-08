import { Config, setupAutocomplete, includes } from "./extension";
import { getParent } from "@ideal-postcodes/jsutil";
import { selectors } from "./billing";
export { selectors };

const parentScope = "fieldset";
const parentTest = (e: HTMLElement) => e.className === "admin__fieldset";

const pageTest = () => includes(window.location.pathname, "/customer");

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, {
    pageTest,
    getScope: (anchor: HTMLElement) => getParent(anchor, parentScope, parentTest)
  });
};
