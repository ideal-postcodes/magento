import { test as base, expect, Page, Locator } from "@playwright/test";
import { Address } from "@ideal-postcodes/api-typings";
import { Selectors } from "@ideal-postcodes/jsutil";

export interface TestFixtures {
  setupPage: (url: string, postcodeLookup?: boolean) => Promise<void>;
  shadowDom: ShadowDomHelpers;
}

export interface ShadowDomHelpers {
  getPostcodeInput: (scope?: Locator) => Promise<Locator>;
  getPostcodeButton: (scope?: Locator) => Promise<Locator>;
  getPostcodeSelect: (scope?: Locator) => Promise<Locator>;
  typePostcode: (postcode: string, scope?: Locator) => Promise<void>;
  clickLookup: (scope?: Locator) => Promise<void>;
  selectAddress: (index: number, scope?: Locator) => Promise<void>;
}

const API_KEY = process.env.API_KEY || "ak_go";

const adminSourcesMap = [
  { type: "js", url: "http://localhost:60154/test/snapshot/fixtures/admin.js" },
  { type: "js", url: "http://localhost:60154/test/snapshot/fixtures/start.js" },
];

const storeSourcesMap = [
  { type: "js", url: "http://localhost:60154/test/snapshot/fixtures/jquery.js" },
  { type: "js", url: "http://localhost:60154/test/snapshot/fixtures/store.js" },
  { type: "js", url: "http://localhost:60154/test/snapshot/fixtures/start.js" },
];

export const test = base.extend<TestFixtures>({
  setupPage: async ({ page }, use) => {
    const setup = async (url: string, postcodeLookup = false) => {
      await page.addInitScript((config) => {
        (window as any).idpcConfig = {
          apiKey: config.apiKey,
          populateOrganisation: true,
          populateCounty: true,
          autocomplete: true,
          postcodeLookup: config.postcodeLookup,
          postcodeLookupOverride: {
            checkKey: false,
          },
          autocompleteOverride: {
            checkKey: false,
            defaultCountry: "GBR",
            detectCountry: false,
          },
          customFields: [],
        };
      }, { apiKey: API_KEY, postcodeLookup });

      await page.goto(url);

      const resources = postcodeLookup ? storeSourcesMap : adminSourcesMap;
      for (const resource of resources) {
        if (resource.type === "js") {
          await page.addScriptTag({ url: resource.url });
        }
      }

      await page.waitForTimeout(2000);
    };

    await use(setup);
  },

  shadowDom: async ({ page }, use) => {
    const helpers: ShadowDomHelpers = {
      getPostcodeInput: async (scope?: Locator) => {
        const container = scope || page.locator("body");
        const shadowHost = container.locator("[idpc]").first();
        
        // For closed shadow DOM, we need to use evaluate
        const inputHandle = await shadowHost.evaluateHandle((el) => {
          const shadow = (el as any).__shadowRoot || el.shadowRoot;
          return shadow?.querySelector(".idpc-input, input[type='text']");
        });
        
        return page.locator(`[idpc] >> nth=0`).locator("internal:shadow=input");
      },

      getPostcodeButton: async (scope?: Locator) => {
        const container = scope || page.locator("body");
        return container.locator("[idpc]").first().locator("internal:shadow=button");
      },

      getPostcodeSelect: async (scope?: Locator) => {
        const container = scope || page.locator("body");
        return container.locator("[idpc]").first().locator("internal:shadow=select");
      },

      typePostcode: async (postcode: string, scope?: Locator) => {
        const container = scope || page.locator("body");
        const shadowHost = container.locator(".idpc_lookup_host").first();
        
        await shadowHost.evaluate((el, pc) => {
          const shadow = (el as any).__idpcShadowRoot;
          const input = shadow?.querySelector(".idpc-input, input") as HTMLInputElement;
          if (input) {
            input.value = pc;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
        }, postcode);
      },

      clickLookup: async (scope?: Locator) => {
        const container = scope || page.locator("body");
        const shadowHost = container.locator(".idpc_lookup_host").first();
        
        await shadowHost.evaluate((el) => {
          const shadow = (el as any).__idpcShadowRoot;
          const button = shadow?.querySelector("button") as HTMLButtonElement;
          button?.click();
        });
      },

      selectAddress: async (index: number, scope?: Locator) => {
        const container = scope || page.locator("body");
        const shadowHost = container.locator(".idpc_lookup_host").first();
        
        await shadowHost.evaluate((el, idx) => {
          const shadow = (el as any).__idpcShadowRoot;
          const select = shadow?.querySelector("select") as HTMLSelectElement;
          if (select) {
            select.value = String(idx);
            select.dispatchEvent(new Event("change", { bubbles: true }));
          }
        }, index);
      },
    };

    await use(helpers);
  },
});

export { expect };
