import { Selectors } from "@ideal-postcodes/jsutil";
import { Address } from "@ideal-postcodes/api-typings";

interface Suite {
  scope: string;
  selectors: Selectors;
  address: Address;
}

export const setupSuite = (suite: Suite, country?: boolean): void => {
  const scope = suite.scope;
  const selectors = suite.selectors;
  const address = suite.address;

  it("Setup", () => {
    cy.wait(1000);
    cy.get(scope).within(() => {
      if (country) {
        cy.get(selectors.country).should("have.value", "US");
      } else {
        cy.get(selectors.country).should("have.value", "");
        cy.get(selectors.country).select("US");
      }
      cy.get("#idpc_input").should("be.not.visible");
      cy.get(selectors.line_1)
        .clear({
          force: true
        })
        .type(address.line_1, {
          force: true
        });
      cy.get(".idpc_ul li").should("have.length", 0);
      cy.get(selectors.country).select("GB");
      cy.wait(2000);
      cy.get(selectors.line_1)
        .clear({
          force: true
        })
        .type(address.line_1, {
          force: true
        });
      cy.wait(2000);
      cy.get(".idpc_ul li").should("not.have.length", 0);
    });
  });
};

const assertions = (selectors: Selectors, address: Address) => {
  cy.get(selectors.line_1).should("have.value", address.line_1);
  selectors.line_2 &&
    cy
      .get(selectors.line_2)
      .should("have.value", `${address.line_2}, ${address.line_3}`);
  selectors.organisation &&
    cy
      .get(selectors.organisation)
      .should("have.value", address.organisation_name);
  cy.get(selectors.post_town).should("have.value", address.post_town);
  cy.get(selectors.country).should("have.value", "JE");
  cy.get(selectors.postcode).should("have.value", address.postcode);
};

export const autocompleteSuite = (suite: Suite) => {
  const scope = suite.scope;
  const selectors = suite.selectors;
  const address = suite.address;

  it("Autocomplete", () => {
    cy.get(scope).within(() => {
      cy.get(selectors.country).select("GB");
      cy.get(selectors.line_1)
        .clear({
          force: true
        })
        .type(address.line_1, {
          force: true
        });
      cy.wait(2000);
      cy.get(".idpc_ul li")
        .first()
        .click();
      assertions(selectors, address);
    });
  });
};

export const postcodeLookupSuite = (suite: Suite) => {
  const scope = suite.scope;
  const selectors = suite.selectors;
  const address = suite.address;

  it("Postcode Lookup", () => {
    cy.get(scope).within(() => {
      cy.get(selectors.country).select("GB");
      cy.get("#idpc_input")
        .clear({
          force: true
        })
        .type(address.postcode, {
          force: true
        });
      cy.get("#idpc_button").click();
      cy.wait(1000);
      cy.get("#idpc_dropdown").select("0");
      assertions(selectors, address);
    });
  });
};
