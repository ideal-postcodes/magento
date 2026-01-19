/**
 * Ideal Postcodes UK Address Search - Store Initialization
 *
 * This module receives configuration from x-magento-init and initializes
 * the Ideal Postcodes address search functionality for the storefront.
 */
define(['idealpostcodes_binding'], function () {
    'use strict';

    return function (config) {
        if (!config.enabled) {
            return;
        }

        window.idpcConfig = {
            apiKey: config.apiKey,
            postcodeLookup: config.postcodeLookup,
            autocomplete: config.autocomplete,
            populateCounty: config.populateCounty,
            removeOrganisation: config.removeOrganisation,
            hoistCountry: config.hoistCountry,
            autocompleteOverride: config.autocompleteOverride,
            postcodeLookupOverride: config.postcodeLookupOverride,
            customFields: config.customFields
        };

        if (typeof window.idpcStart === 'function') {
            window.idpcStart();
        }
    };
});
