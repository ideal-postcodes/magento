<?php
/**
 * Copyright (c) Ideal Postcodes Ltd
 *
 * Ideal Postcodes Magento Extension
 *
 * This extension provides UK address search functionality for Magento 2
 * checkout and customer address forms using the Ideal Postcodes API.
 *
 * @package   Idealpostcodes_Ukaddresssearch
 * @author    Ideal Postcodes <support@ideal-postcodes.co.uk>
 * @copyright Ideal Postcodes Ltd
 * @license   MIT https://opensource.org/licenses/MIT
 * @link      https://ideal-postcodes.co.uk
 */

namespace Idealpostcodes\Ukaddresssearch\Setup;

use Magento\Framework\Setup\UpgradeDataInterface;
use Magento\Framework\Setup\ModuleContextInterface;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Customer\Setup\CustomerSetupFactory;
use Magento\Customer\Api\AddressMetadataInterface;

/**
 * Upgrade Data Script
 *
 * This script updates the city attribute validation rules to allow
 * real-world city names with periods (e.g., "St. Helen"), numbers,
 * ampersands, and other common punctuation marks.
 *
 * The default Magento validation regex is too restrictive and only
 * allows letters and spaces, which fails for cities like:
 * - St. Moritz
 * - Brighton & Hove
 * - 29 Palms
 *
 * This override implements a more permissive pattern while maintaining
 * security and data integrity.
 */
class UpgradeData implements UpgradeDataInterface
{
    /**
     * @var CustomerSetupFactory
     */
    protected $customerSetupFactory;

    /**
     * Constructor
     *
     * @param CustomerSetupFactory $customerSetupFactory
     */
    public function __construct(CustomerSetupFactory $customerSetupFactory)
    {
        $this->customerSetupFactory = $customerSetupFactory;
    }

    /**
     * Upgrade data for the module
     *
     * @param ModuleDataSetupInterface $setup
     * @param ModuleContextInterface $context
     * @return void
     */
    public function upgrade(ModuleDataSetupInterface $setup, ModuleContextInterface $context)
    {
        // Apply city validation override for version 3.1.3
        if (version_compare($context->getVersion(), '3.1.3', '<')) {
            $this->updateCityValidationRules($setup);
        }
    }

    /**
     * Update city attribute validation rules
     *
     * Overrides the default city validation regex to allow:
     * - Letters (A-Z, a-z)
     * - Numbers (0-9)
     * - Spaces
     * - Hyphens (-)
     * - Periods/dots (.)
     * - Ampersands (&)
     * - Parentheses ()
     * - Apostrophes (')
     *
     * This allows for real-world city names like:
     * - "St. Helen", "St. Moritz" (periods in abbreviations)
     * - "Brighton & Hove" (ampersands)
     * - "29 Palms" (numbers)
     * - "King's Lynn" (apostrophes)
     * - "Ashton-under-Lyne" (hyphens)
     *
     * @param ModuleDataSetupInterface $setup
     * @return void
     */
    protected function updateCityValidationRules(ModuleDataSetupInterface $setup)
    {
        $setup->startSetup();

        $customerSetup = $this->customerSetupFactory->create(['setup' => $setup]);

        // Get the address entity type ID
        $addressEntityTypeId = $customerSetup->getEntityTypeId(
            AddressMetadataInterface::ENTITY_TYPE_ADDRESS
        );

        // Get the current city attribute configuration
        $cityAttribute = $customerSetup->getAttribute($addressEntityTypeId, 'city');

        if ($cityAttribute) {
            // Get existing validation rules
            $validateRules = $cityAttribute['validate_rules'] ?? [];

            // Decode JSON if it's stored as a string
            if (is_string($validateRules)) {
                $validateRules = json_decode($validateRules, true) ?: [];
            }

            // Remove restrictive validation rules
            // Keep only max_text_length and min_text_length
            $validateRules = [
                'max_text_length' => 255,
                'min_text_length' => 1,
                'input_validation' => 'length'  // Only validate length, not character type
            ];

            // Update the attribute with relaxed validation rules
            // This removes the validate-alpha restriction
            // input_filter strips HTML tags to prevent XSS attacks
            $customerSetup->updateAttribute(
                $addressEntityTypeId,
                'city',
                [
                    'validate_rules' => json_encode($validateRules, JSON_UNESCAPED_SLASHES),
                    'frontend_class' => null,  // Remove any frontend validation classes
                    'input_filter' => 'striptags'  // Strip HTML/XML tags for XSS protection
                ]
            );
        }

        $setup->endSetup();
    }
}
