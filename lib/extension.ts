declare global {
  interface Window {
    IdealPostcodes: any;
    idpcStart: any;
  }
}

import {
  Config as BaseConfig,
  getParent,
  insertBefore,
  UkCountry,
  CountryIso,
  ParentTest,
  Country,
  OutputFields,
  toElem,
  Targets,
} from "@ideal-postcodes/jsutil";

import { AddressFinder } from "@ideal-postcodes/address-finder";
import { PostcodeLookup } from "@ideal-postcodes/postcode-lookup";

export interface Config extends BaseConfig {
  hoistCountry?: boolean;
  removeOrganisation: boolean;
  customFields?: OutputFields[];
}

interface LinesIdentifier {
  parentScope: string;
  parentTest: ParentTest;
}

const isAmasty = () => {
  // @ts-ignore
  if (typeof require === 'function' && require.defined('Amasty_GdprFrontendUi/js/model/need-show')) {
    console.log('Amasty_GdprFrontendUi/js/model/need-show');
    return true;
  }
  return false;
};

// Closed shadow DOM styles for postcode lookup
const SHADOW_STYLES = `
  :host {
    display: block;
    position: relative;
    margin-bottom: 15px;
  }
  .idpc_lookup {
    display: block;
    width: 100%;
  }
  .idpc_lookup label {
    display: block;
    width: 100%;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .idpc_lookup input[type="text"],
  .idpc_lookup input:not([type]) {
    display: inline-block;
    width: 70%;
    padding: 10px 12px;
    border: 1px solid #ccc;
    border-right: none;
    border-radius: 1px 0 0 1px;
    box-sizing: border-box;
    font-size: 14px;
    vertical-align: middle;
    margin: 0;
  }
  .idpc_lookup input[type="text"]:focus,
  .idpc_lookup input:not([type]):focus {
    outline: none;
    box-shadow: 0 0 3px 1px #00699d;
    z-index: 1;
    position: relative;
  }
  .idpc_lookup button {
    display: inline-block;
    width: 30%;
    padding: 10px 12px;
    margin: 0;
    margin-left: -1px;
    background-color: #1979c3;
    color: white;
    border: 1px solid #1979c3;
    border-radius: 0 1px 1px 0;
    cursor: pointer;
    font-size: 14px;
    white-space: nowrap;
    vertical-align: middle;
    box-sizing: border-box;
  }
  .idpc_lookup button:hover {
    background-color: #006bb4;
    border-color: #006bb4;
  }
  .idpc_lookup button:active {
    background-color: #005a9e;
    border-color: #005a9e;
  }
  .idpc_lookup select {
    display: block;
    width: 100%;
    padding: 10px 12px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 1px;
    font-size: 14px;
    background-color: white;
    cursor: pointer;
    box-sizing: border-box;
  }
  .idpc_lookup select:focus {
    box-shadow: 0 0 3px 1px #00699d;
    outline: none;
  }
  .idpc_lookup .idpc-error,
  .idpc_lookup .idpc-message {
    display: block;
    width: 100%;
    padding: 8px 12px;
    margin-top: 5px;
    border-radius: 4px;
    font-size: 13px;
    box-sizing: border-box;
  }
  .idpc_lookup .idpc-error {
    background-color: #fdecea;
    color: #c00;
    border: 1px solid #f5c6cb;
  }
`;

// Store for closed shadow roots (internal access only)
const shadowRoots = new WeakMap<HTMLElement, ShadowRoot>();

/**
 * Creates a closed shadow DOM container that external JS cannot access
 * @returns Object with host element and internal shadow root reference
 */
export const createClosedShadowContainer = (): {
  host: HTMLElement;
  shadow: ShadowRoot;
  container: HTMLElement;
} => {
  const host = document.createElement("div");
  host.className = "idpc_lookup_host";
  
  // Closed mode - element.shadowRoot returns null for external JS
  const shadow = host.attachShadow({ mode: "closed" });
  
  // Store reference internally
  shadowRoots.set(host, shadow);
  
  // Store on element for testing (prefixed to avoid conflicts)
  (host as any).__idpcShadowRoot = shadow;
  
  // Inject styles
  const style = document.createElement("style");
  style.textContent = SHADOW_STYLES;
  shadow.appendChild(style);
  
  // Create container for lookup elements
  const container = document.createElement("div");
  container.className = "idpc_lookup field";
  shadow.appendChild(container);
  
  return { host, shadow, container };
};

export const hoistCountry = (
  config: Config,
  outputFields: Targets,
  linesIdentifier?: LinesIdentifier
) => {
  if (config.hoistCountry !== true) return;
  if (!outputFields.country) return;
  if (!outputFields.line_1) return;
  const elem = getParent(outputFields.country, "div", (e) =>
    e.classList.contains("field")
  );
  if (!elem) return;
  const target = getLinesContainer(outputFields, linesIdentifier);
  if (!target) return;
  if (!elem.hasAttribute("country-hoist")) {
    elem.setAttribute("country-hoist", "true");
    insertBefore({ elem, target });
  }
};

export const getLinesContainer = (
  { line_1 }: Targets,
  linesIdentifier?: LinesIdentifier
): HTMLElement | null => {
  if (line_1 === null) return null;
  const parentScope = linesIdentifier
    ? linesIdentifier.parentScope
    : "fieldset";
  const parentTest = linesIdentifier
    ? linesIdentifier.parentTest
    : (e: HTMLElement) => e.classList.contains("field");

  return getParent(line_1 as HTMLElement, parentScope, parentTest);
};

type SupportedCountry = UkCountry | CountryIso | Country;

const SUPPORTED_COUNTRIES: SupportedCountry[] = [
  "England",
  "Scotland",
  "Wales",
  "Northern Ireland",
  "Channel Islands",
  "Isle of Man",
  "United Kingdom",
  "Jersey",
  "Guernsey",
  "GB",
  "IM",
  "JE",
  "GG",
];

const EXTENDED_COUNTRIES: string[] = ["United States of America", "US"];

export const supportedCountries = (extended: boolean): string[] => {
  //@ts-expect-error
  if (extended) return SUPPORTED_COUNTRIES.concat(EXTENDED_COUNTRIES);
  return SUPPORTED_COUNTRIES;
};

export const countryIsSupported = (
  e: HTMLInputElement | HTMLSelectElement,
  extended: boolean = false
): boolean => {
  const country = e.value;
  return supportedCountries(extended).reduce<boolean>((prev, supported) => {
    if (country === supported) return true;
    return prev;
  }, false);
};

export const addLookupLabel = (
  postcodeField: HTMLElement
): HTMLLabelElement => {
  const span = document.createElement("span");
  span.innerText = "Search your Postcode";
  const elem = document.createElement("label");
  elem.className = "label";
  elem.setAttribute("for", "idpc_postcode_lookup");
  elem.appendChild(span);
  insertBefore({ target: postcodeField.firstChild as HTMLElement, elem });
  return elem;
};

const NOOP = () => {};

export const watchCountry = (
  { country }: any,
  activate: any,
  deactivate: any,
  extended: boolean = false
) => {
  if (!country) return NOOP;
  const checkCountry = (target: HTMLInputElement | HTMLSelectElement) => {
    if (countryIsSupported(target, extended)) return activate();
    deactivate();
  };
  country.addEventListener("change", (event: any) => {
    checkCountry(event.target);
  });
  return checkCountry(country);
};

const getFields = (
  outputFields: OutputFields,
  scope: HTMLElement | Document | null
): Targets => {
  const result: any = {};
  Object.keys(outputFields).forEach((key) => {
    //@ts-expect-error
    result[key] = toElem(outputFields[key], scope);
  });
  return result;
};

export const setupPostcodeLookup = (
  config: Config,
  outputFields: OutputFields,
  options: any = {},
  linesIdentifier?: LinesIdentifier
) => {
  if (config.postcodeLookup !== true) return;
  PostcodeLookup.watch(
    {
      apiKey: config.apiKey,
      checkKey: true,
      context: "div.idpc_lookup",
      outputFields,
      removeOrganisation: config.removeOrganisation,
      populateCounty: config.populateCounty,
      selectStyle: {
        "margin-top": "5px",
        "margin-bottom": "5px",
      },
      buttonStyle: {
        position: "absolute",
        right: 0,
      },
      contextStyle: {
        position: "relative",
      },
      onLoaded() {
        // Add search label
        const label = addLookupLabel(this.context);
        watchCountry(
          this.options.outputFields,
          () => {
            label.hidden = false;
            this.context.style.display = "block";
          },
          () => {
            label.hidden = true;
            this.context.style.display = "none";
          }
        );
      },
      ...config.postcodeLookupOverride,
    },
    {
      getScope: (anchor: HTMLElement) => getParent(anchor, "FORM"),
      anchor: outputFields.line_1,
      onAnchorFound(options) {
        const { scope } = options;
        const targets = getFields(outputFields, scope);
        const target = getLinesContainer(targets, linesIdentifier);
        //@ts-expect-error
        options.config.outputFields = targets;
        if (target === null) return;
        hoistCountry(config, targets, linesIdentifier);
        if (target.parentElement?.querySelector('.idpc_lookup_host[idpc="true"]'))
          return;
        
        // Create closed shadow DOM container - external JS cannot access elements inside
        const { host, container } = createClosedShadowContainer();
        host.setAttribute("idpc", "true");
        options.config.context = container;
        
        if (isAmasty()) {
          return target.prepend(host);
        }
        return insertBefore({ target, elem: host });
      },
      ...options,
    }
  );
};

export const setupAutocomplete = async (
  config: Config,
  outputFields: OutputFields,
  options: any = {},
  linesIdentifier?: LinesIdentifier
) => {
  if (config.autocomplete !== true) return;
  if (outputFields.line_1 === undefined) return;
  await AddressFinder.watch(
    {
      apiKey: config.apiKey,
      checkKey: true,
      removeOrganisation: config.removeOrganisation,
      populateCounty: config.populateCounty,
      onLoaded() {
        //@ts-expect-error
        this.options.outputFields = getFields(outputFields, this.scope);
        //@ts-expect-error
        hoistCountry(config, this.options.outputFields, linesIdentifier);
        watchCountry(
          this.options.outputFields,
          () => this.attach(),
          () => this.detach(),
          true
        );
      },
      outputFields,
      ...config.autocompleteOverride,
    },
    options
  );
};

export const includes = (haystack: string, needle: string): boolean =>
  haystack.indexOf(needle) !== -1;
