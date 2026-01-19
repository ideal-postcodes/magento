<?php
/**
 * Copyright (c) IDDQD Ltd
 *
 * Ideal Postcodes Magento Extension
 *
 * This extension provides UK address search functionality for Magento 2
 * checkout and customer address forms using the Ideal Postcodes API.
 *
 * @package   Idealpostcodes_Ukaddresssearch
 * @author    Ideal Postcodes <support@ideal-postcodes.co.uk>
 * @copyright IDDQD Ltd
 * @license   MIT https://opensource.org/licenses/MIT
 * @link      https://ideal-postcodes.co.uk
 */

declare(strict_types=1);

namespace Idealpostcodes\Ukaddresssearch\Setup\Patch\Data;

use Magento\Customer\Api\AddressMetadataInterface;
use Magento\Customer\Setup\CustomerSetupFactory;
use Magento\Framework\Setup\ModuleDataSetupInterface;
use Magento\Framework\Setup\Patch\DataPatchInterface;
use Magento\Framework\Setup\Patch\PatchVersionInterface;

/**
 * Data Patch: Update City Validation Rules
 *
 * This patch updates the city attribute validation rules to allow
 * real-world city names with periods (e.g., "St. Helen"), numbers,
 * ampersands, and other common punctuation marks.
 *
 * The default Magento validation regex is too restrictive and only
 * allows letters and spaces, which fails for cities like:
 * - St. Moritz
 * - Brighton & Hove
 * - 29 Palms
 *
 * This patch implements a more permissive pattern while maintaining
 * security and data integrity.
 */
class UpdateCityValidation implements DataPatchInterface, PatchVersionInterface
{
    /**
     * @var ModuleDataSetupInterface
     */
    private $moduleDataSetup;

    /**
     * @var CustomerSetupFactory
     */
    private $customerSetupFactory;

    /**
     * Constructor
     *
     * @param ModuleDataSetupInterface $moduleDataSetup
     * @param CustomerSetupFactory $customerSetupFactory
     */
    public function __construct(
        ModuleDataSetupInterface $moduleDataSetup,
        CustomerSetupFactory $customerSetupFactory
    ) {
        $this->moduleDataSetup = $moduleDataSetup;
        $this->customerSetupFactory = $customerSetupFactory;
    }

    /**
     * Apply the patch
     *
     * @return void
     */
    public function apply(): void
    {
        $this->moduleDataSetup->startSetup();

        $customerSetup = $this->customerSetupFactory->create(['setup' => $this->moduleDataSetup]);

        $addressEntityTypeId = $customerSetup->getEntityTypeId(
            AddressMetadataInterface::ENTITY_TYPE_ADDRESS
        );

        $cityAttribute = $customerSetup->getAttribute($addressEntityTypeId, 'city');

        if ($cityAttribute) {
            $validateRules = [
                'max_text_length' => 255,
                'min_text_length' => 1,
                'input_validation' => 'length'
            ];

            $customerSetup->updateAttribute(
                $addressEntityTypeId,
                'city',
                [
                    'validate_rules' => json_encode($validateRules, JSON_UNESCAPED_SLASHES),
                    'frontend_class' => null,
                    'input_filter' => 'striptags'
                ]
            );
        }

        $this->moduleDataSetup->endSetup();
    }

    /**
     * Get array of patches that have to be executed prior to this
     *
     * @return array
     */
    public static function getDependencies(): array
    {
        return [];
    }

    /**
     * Get aliases for the patch
     *
     * @return array
     */
    public function getAliases(): array
    {
        return [];
    }

    /**
     * Get the version this patch was introduced in
     *
     * This ensures backward compatibility with the old UpgradeData script
     *
     * @return string
     */
    public static function getVersion(): string
    {
        return '3.1.3';
    }
}
