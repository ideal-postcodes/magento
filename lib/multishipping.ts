import { setupBind } from "@ideal-postcodes/jsutil";
import {
  Config,
  includes,
  setupAutocomplete,
  setupPostcodeLookup,
  hoistCountry,
} from "./extension";

export const selectors = {
  line_1: "#street_1",
  line_2: "#street_2",
  line_3: "#street_3",
  organisation: "#company",
  post_town: "#city",
  county: "#region",
  country: "#country",
  postcode: '[name="postcode"]',
};

const linesIdentifier = {
  parentScope: "div",
  parentTest: (e: HTMLElement) =>
    e.classList.contains("field") && e.classList.contains("street"),
};

const bind = (config: Config) => {
  setupBind({
    selectors,
    parentTest: (e) => e.getAttribute("id") === "form-validate",
  }).forEach(({ targets }) => {
    hoistCountry(config, targets, linesIdentifier);
    setupAutocomplete(config, targets);
    setupPostcodeLookup(config, targets, linesIdentifier);
  });
};

const pageTest = () => includes(window.location.pathname, "/multishipping");

export const bindings = { bind, pageTest };
