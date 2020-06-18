declare global {
  interface Window {
    IdealPostcodes: any;
    jQuery: any;
    idpcStart: any;
  }
}

import {
  Config as BaseConfig,
  Targets,
  getParent,
  insertBefore,
  addressRetrieval,
  UkCountry,
  CountryIso,
  ParentTest,
  Country
} from "@ideal-postcodes/jsutil";

export interface Config extends BaseConfig {
  hoistCountry?: boolean;
}

interface LinesIdentifier {
  parentScope: string;
  parentTest: ParentTest;
}

export const hoistCountry = (
  config: Config,
  targets: Targets,
  linesIdentifier?: LinesIdentifier
) => {
  if (config.hoistCountry !== true) return;
  if (!targets.country) return;
  if (!targets.line_1) return;

  const elem = getParent(targets.country, "div", e =>
    e.classList.contains("field")
  );
  if (!elem) return;

  const target = getLinesContainer(targets, linesIdentifier);
  if (!target) return;

  insertBefore({ elem, target });
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

  return getParent(line_1, parentScope, parentTest);
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
  "GG"
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

export const detachAutocomplete = (instance: any) => {
  const i = instance.interface;
  if (!i) return;
  const input = i.input;

  // Disable current autocomplet activity just in case
  i._onBlurBound();

  // Detact listeners
  input.removeEventListener("input", i._onInputBound);
  input.removeEventListener("blur", i._onBlurBound);
  input.removeEventListener("focus", i._onFocusBound);
  input.removeEventListener("keydown", i._onKeyDownBound);
  i.suggestionList.removeEventListener("mousedown", i._onMousedownBound);
};

export const attachAutocomplete = (instance: any) => {
  if (!instance.interface) return;
  instance.interface.initialiseEventListeners();
};

export const insertPostcodeField = (
  targets: Targets,
  linesIdentifier?: LinesIdentifier
): HTMLElement | null => {
  const target = getLinesContainer(targets, linesIdentifier);
  if (target === null) return null;
  const postcodeField = document.createElement("div");
  postcodeField.className = "idpc_lookup field";
  insertBefore({ target, elem: postcodeField });
  return postcodeField;
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
  insertBefore({ target: postcodeField, elem });
  return elem;
};

const NOOP = () => {};

export const watchCountry = (
  { country }: Targets,
  activate: any,
  deactivate: any
) => {
  if (!country) return NOOP;
  const checkCountry = () => {
    if (countryIsSupported(country as HTMLSelectElement)) return activate();
    deactivate();
  };
  country.addEventListener("change", checkCountry);
  return checkCountry;
};

export const setupPostcodeLookup = (
  config: Config,
  targets: Targets,
  linesIdentifier?: LinesIdentifier
) => {
  if (config.postcodeLookup !== true) return;
  const postcodeField = insertPostcodeField(targets, linesIdentifier);
  if (postcodeField === null) return;
  const controller = window.jQuery(postcodeField).setupPostcodeLookup({
    api_key: config.apiKey,
    check_key: true,
    onLoaded: () => {
      // Add search label
      const label = addLookupLabel(postcodeField);
      watchCountry(
        targets,
        () => {
          label.hidden = false;
          controller.show();
        },
        () => {
          label.hidden = true;
          controller.hide();
        }
      )();
    },
    onAddressSelected: addressRetrieval({ config, targets })
  });
};

export const setupAutocomplete = (config: Config, targets: Targets) => {
  if (config.autocomplete !== true) return;
  if (targets.line_1 === null) return;
  const controller = new window.IdealPostcodes.Autocomplete.Controller({
    api_key: config.apiKey,
    checkKey: true,
    onLoaded: () => {
      watchCountry(
        targets,
        () => attachAutocomplete(controller),
        () => detachAutocomplete(controller)
      )();
    },
    // Need to better uniquely identify line 1
    inputField: targets.line_1,
    onAddressRetrieved: addressRetrieval({ config, targets })
  });
};
