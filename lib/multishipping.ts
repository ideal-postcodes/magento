import {
  Config,
  includes,
  setupAutocomplete,
  setupPostcodeLookup,
} from "./extension";

export const selectors = {
  line_1: "#street_1",
  line_2: "#street_2",
  line_3: "#street_3",
  organisation_name: "#company",
  post_town: "#city",
  county: "#region",
  country: "#country",
  postcode: '[name="postcode"]',
};

export const linesIdentifier = {
  parentScope: "div",
  parentTest: (e: HTMLElement) =>
    e.classList.contains("field"),
};

const pageTest = () => includes(window.location.pathname, "/multishipping");

export const bind = (config: Config) => {
  setupAutocomplete(config, selectors, { pageTest }, linesIdentifier);
  setupPostcodeLookup(config, selectors, { pageTest }, linesIdentifier);
};
