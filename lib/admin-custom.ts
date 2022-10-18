import { Config, setupAutocomplete } from "./extension";
import { getParent } from "@ideal-postcodes/jsutil";

const parentScope = "fieldset";
const parentTest = (e: HTMLElement) => e.className === "admin__fieldset";

const pageTest = () => true;

export const bind = (config: Config) => {
    const fields = config.customFields || [];
    fields.forEach((selectors) => {
        setupAutocomplete(config, selectors, {
            pageTest,
            getScope: (anchor: HTMLElement) => {
                let parent = getParent(anchor, parentScope, parentTest);
                if(parent) return parent
                return getParent(anchor, "FORM");
            }
        });
    })
};
