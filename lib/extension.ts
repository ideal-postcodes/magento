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

const tags = ["magento"];
const postcodeLookupTags = [...tags, "postcodelookup"];
const addressFinderTags = [...tags, "addressfinder"].join(",");

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

const INPUT_TAGS = ["INPUT", "SELECT", "TEXTAREA"];

/**
 * Resolves Postcode Lookup `hide` entries against the address form. Entries
 * pointing at an input (e.g. `[name="postcode"]`) are widened to their `.field`
 * wrapper so the label is hidden along with the input
 */
export const resolveHiddenFields = (
  hide: (string | HTMLElement)[] | undefined,
  scope: HTMLElement | Document | null
): HTMLElement[] => {
  if (!hide) return [];
  return hide.reduce<HTMLElement[]>((result, entry) => {
    const elem =
      typeof entry === "string" ? toElem(entry, scope || document) : entry;
    if (!elem) return result;
    if (INPUT_TAGS.indexOf(elem.tagName) === -1) return [...result, elem];
    const field = getParent(elem, "div", (e) => e.classList.contains("field"));
    return [...result, field || elem];
  }, []);
};

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
      tags: postcodeLookupTags,
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
            this.hideFields();
          },
          () => {
            label.hidden = true;
            this.context.style.display = "none";
            this.unhideFields();
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
        options.config.hide = resolveHiddenFields(options.config.hide, scope);
        if (target === null) return;
        hoistCountry(config, targets, linesIdentifier);
        if (target.parentElement?.querySelector('.idpc_lookup[idpc="true"]'))
          return;
        const postcodeField = document.createElement("div");
        postcodeField.className = "idpc_lookup field";
        options.config.context = postcodeField;
        return insertBefore({ target, elem: postcodeField });
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
      queryOptions: { tags: addressFinderTags },
      resolveOptions: { tags: addressFinderTags },
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

/**
 * Matches Magento's own `/checkout` as well as third-party checkout routes
 * such as `/onestepcheckout`, `/onepagecheckout` and `/firecheckout`
 */
export const isCheckoutPage = (
  pathname: string = window.location.pathname
): boolean => includes(pathname.toLowerCase(), "checkout");
