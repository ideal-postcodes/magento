import { setupBind } from "@ideal-postcodes/jsutil";

import { Config, setupAutocomplete } from "./extension";

import { selectors } from "./billing";

const parentScope = "fieldset";
const parentTest = (e: HTMLElement) => e.className === "admin__fieldset";

const bind = (config: Config) => {
  setupBind({ selectors, parentScope, parentTest }).forEach(({ targets }) => {
    console.log(selectors);
    setupAutocomplete(config, targets);
  });
};

const pageTest = () => window.location.pathname.includes("/customer");

export const bindings = { bind, pageTest };
