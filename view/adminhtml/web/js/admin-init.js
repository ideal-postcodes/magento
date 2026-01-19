/**
 * Ideal Postcodes UK Address Search - Admin Initialization
 *
 * This module receives configuration from x-magento-init and initializes
 * the Ideal Postcodes address search functionality for the admin panel.
 */
define(['idealpostcodes_admin'], function () {
    'use strict';

    return function (config) {
        if (!config.enabled || !config.apiKey) {
            return;
        }

        window.idpcConfig = {
            apiKey: config.apiKey,
            postcodeLookup: config.postcodeLookup,
            autocomplete: config.autocomplete,
            populateCounty: config.populateCounty,
            removeOrganisation: config.removeOrganisation,
            hoistCountry: config.hoistCountry,
            customFields: config.customFields
        };

        if (typeof window.idpcStart === 'function') {
            window.idpcStart();
        }
    };
});
