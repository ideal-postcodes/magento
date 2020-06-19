import { setupBind } from "@ideal-postcodes/jsutil";

import { Config, setupAutocomplete } from "./extension";

import { selectors } from "./billing";

export { selectors };

const parentScope = "fieldset";
const parentTest = (e: HTMLElement) => e.className === "admin__fieldset";

const bind = (config: Config) => {
  setupBind({ selectors, parentScope, parentTest }).forEach(({ targets }) => {
    setupAutocomplete(config, targets);
  });
};

const pageTest = () => window.location.pathname.includes("/customer");

export const bindings = { bind, pageTest };
