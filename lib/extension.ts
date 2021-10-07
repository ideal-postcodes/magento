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
  toElem
} from "@ideal-postcodes/jsutil";

import { AddressFinder } from "@ideal-postcodes/address-finder";
import { PostcodeLookup } from "@ideal-postcodes/postcode-lookup";

export interface Config extends BaseConfig {
  hoistCountry?: boolean;
}

interface LinesIdentifier {
  parentScope: string;
  parentTest: ParentTest;
}

export const hoistCountry = (
  config: Config,
  outputFields: OutputFields,
  linesIdentifier?: LinesIdentifier
) => {
  if (config.hoistCountry !== true) return;
  if (!outputFields.country) return;
  if (!outputFields.line_1) return;
  const elem = getParent(
    toElem(outputFields.country, document) as HTMLElement,
    "div",
    (e) => e.classList.contains("field")
  );
  if (!elem) return;
  const target = getLinesContainer(outputFields, linesIdentifier);
  if (!target) return;
  if(!elem.hasAttribute("country-hoist")) {
    elem.setAttribute("country-hoist", "true");
    insertBefore({ elem, target });
  }

};

export const getLinesContainer = (
  { line_1 }: OutputFields,
  linesIdentifier?: LinesIdentifier
): HTMLElement | null => {
  if (line_1 === null) return null;
  const parentScope = linesIdentifier
    ? linesIdentifier.parentScope
    : "fieldset";
  const parentTest = linesIdentifier
    ? linesIdentifier.parentTest
    : (e: HTMLElement) => e.classList.contains("field");

  return getParent(
    toElem(line_1 as string, document) as HTMLElement,
    parentScope,
    parentTest
  );
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

export const countryIsSupported = (
  e: HTMLInputElement | HTMLSelectElement
): boolean => {
  const country = e.value;
  return SUPPORTED_COUNTRIES.reduce<boolean>((prev, supported) => {
    if (country === supported) return true;
    return prev;
  }, false);
};

export const insertPostcodeField = (
  outputFields: OutputFields,
  linesIdentifier?: LinesIdentifier
): Promise<HTMLElement | null> => {
  const search = (resolve: any): void => {
    const line_1 = toElem(outputFields.line_1 as string, document)
    if(line_1 === null) {
      setTimeout(() => search(resolve), 1000);
      return;
    }
    const target = getLinesContainer(outputFields, linesIdentifier);
    if (target === null) {
      resolve(null);
      return;
    }
    const postcodeField = document.createElement("div");
    postcodeField.className = "idpc_lookup field";
    insertBefore({ target, elem: postcodeField });
    resolve(postcodeField);
  }
  return new Promise((resolve) => {
    search(resolve);
  });

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
  { country }: OutputFields,
  activate: any,
  deactivate: any
) => {
  if (!country) return NOOP;
  const checkCountry = () => {
    if (countryIsSupported(toElem(country, document) as HTMLSelectElement))
      return activate();
    deactivate();
  };
  toElem(country, document)?.addEventListener("change", checkCountry);
  return checkCountry;
};

export const setupPostcodeLookup = (
  config: Config,
  outputFields: OutputFields,
  options: any = {},
  linesIdentifier?: LinesIdentifier
) => {
  if (config.postcodeLookup !== true) return;
  insertPostcodeField(outputFields, linesIdentifier).then((postcodeField) => {
    if (postcodeField === null) return;
    PostcodeLookup.watch(
        {
          apiKey: config.apiKey,
          checkKey: true,
          context: "div.idpc_lookup",
          outputFields,
          selectStyle:{
            "margin-top": "5px",
            "margin-bottom": "5px"
          },
          buttonStyle: {
            "position": "absolute",
            "right": 0
          },
          contextStyle: {
            "position": "relative"
          },
          onLoaded: function () {
            this.options.outputFields = (() => {
              const result:any = {};
              Object.keys(outputFields).forEach((key) => {
                //@ts-expect-error
                result[key] = toElem(outputFields[key], document);
              });
              return result;
            })();
            // Add search label
            const label = addLookupLabel(postcodeField);
            hoistCountry(config, outputFields);
            watchCountry(outputFields,() => {
              label.hidden = false;
              postcodeField.style.display = "block";
            }, () =>
            {
              label.hidden = true;
              postcodeField.style.display = "none"
            })();
          },
          ...config.postcodeLookupOverride
        },
        options
    );
  });
};

export const setupAutocomplete = async (
  config: Config,
  outputFields: OutputFields,
  options: any = {}
) => {
  if (config.autocomplete !== true) return;
  if (outputFields.line_1 === undefined) return;
  await AddressFinder.watch(
    {
      apiKey: config.apiKey,
      checkKey: true,
      onLoaded: function () {
        this.options.outputFields = (() => {
          const result:any = {};
          Object.keys(outputFields).forEach((key) => {
            //@ts-expect-error
            result[key] = toElem(outputFields[key], document);
          });
          return result;
        })();
        hoistCountry(config, outputFields);
        watchCountry(outputFields, () => this.view.attach(), () => this.view.detach())();
      },
      outputFields,
      ...config.autocompleteOverride
    },
    options
  );
};

export const includes = (haystack: string, needle: string): boolean =>
  haystack.indexOf(needle) !== -1;
