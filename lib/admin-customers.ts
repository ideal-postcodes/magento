import { setupBind } from "@ideal-postcodes/jsutil";
import { Config, setupAutocomplete, includes } from "./extension";
import { selectors } from "./billing";
export { selectors };

const parentScope = "fieldset";
const parentTest = (e: HTMLElement) => e.className === "admin__fieldset";

const bind = (config: Config) => {
  setupBind({ selectors, parentScope, parentTest }).forEach(({ targets }) => {
    setupAutocomplete(config, targets);
  });
};

const pageTest = () => includes(window.location.pathname, "/customer");

export const bindings = { bind, pageTest };
