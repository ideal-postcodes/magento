import { Page, Locator, expect } from "@playwright/test";
import { Selectors } from "@ideal-postcodes/jsutil";
import { Address } from "@ideal-postcodes/api-typings";

export interface Suite {
  scope: string;
  selectors: Selectors;
  address: Address;
}

export const assertions = async (
  page: Page,
  scope: Locator,
  selectors: Selectors,
  address: Address
) => {
  await expect(scope.locator(selectors.line_1)).toHaveValue(address.line_1);

  const line3Exists = await scope.locator(selectors.line_3 || "").count() > 0;
  
  if (selectors.line_3 && line3Exists) {
    if (selectors.line_2) {
      await expect(scope.locator(selectors.line_2)).toHaveValue(address.line_2);
    }
    if (selectors.line_3) {
      await expect(scope.locator(selectors.line_3)).toHaveValue(address.line_3);
    }
  } else {
    if (selectors.line_2) {
      await expect(scope.locator(selectors.line_2)).toHaveValue(
        `${address.line_2}, ${address.line_3}`
      );
    }
  }

  if (selectors.organisation) {
    await expect(scope.locator(selectors.organisation)).toHaveValue(
      address.organisation_name
    );
  }

  const town = address.post_town.toLowerCase();
  const formattedTown = town.charAt(0).toUpperCase() + town.slice(1);
  await expect(scope.locator(selectors.post_town)).toHaveValue(formattedTown);
  await expect(scope.locator(selectors.country)).toHaveValue("JE");
  await expect(scope.locator(selectors.postcode)).toHaveValue(address.postcode);
};

export const runAutocompleteSuite = async (
  page: Page,
  suite: Suite
) => {
  const scope = page.locator(suite.scope);
  const { selectors, address } = suite;

  await scope.locator(selectors.country).selectOption("GB", { force: true });
  await page.waitForTimeout(2000);

  await scope.locator(selectors.line_1).clear();
  await scope.locator(selectors.line_1).fill(address.line_1);
  await page.waitForTimeout(3000);

  await page.locator(".idpc_ul li").first().click({ force: true });
  await assertions(page, scope, selectors, address);
};

export const runPostcodeLookupSuite = async (
  page: Page,
  suite: Suite,
  shadowDom: {
    typePostcode: (postcode: string, scope?: Locator) => Promise<void>;
    clickLookup: (scope?: Locator) => Promise<void>;
    selectAddress: (index: number, scope?: Locator) => Promise<void>;
  }
) => {
  const scope = page.locator(suite.scope);
  const { selectors, address } = suite;

  await scope.locator(selectors.country).selectOption("GB", { force: true });
  await page.waitForTimeout(1000);

  await shadowDom.typePostcode(address.postcode, scope);
  await shadowDom.clickLookup(scope);
  await page.waitForTimeout(3000);
  await shadowDom.selectAddress(0, scope);

  await assertions(page, scope, selectors, address);
};
