<?php
namespace Idealpostcodes\Ukaddresssearch\ViewModel;

use Idealpostcodes\Ukaddresssearch\Helper\Data;
use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Serialize\Serializer\Json;

class AdminConfig implements ArgumentInterface
{
    /**
     * @var Data
     */
    private $helper;

    /**
     * @var Json
     */
    private $jsonSerializer;

    /**
     * Constructor
     *
     * @param Data $helper
     * @param Json $jsonSerializer
     */
    public function __construct(Data $helper, Json $jsonSerializer)
    {
        $this->helper = $helper;
        $this->jsonSerializer = $jsonSerializer;
    }

    /**
     * Get admin configuration value for a specific field
     *
     * @param string $field
     * @return mixed
     */
    public function getAdminConfig($field)
    {
        return $this->helper->getAdminConfig($field);
    }

    /**
     * Get full admin configuration as JSON string for x-magento-init
     *
     * @return string
     */
    public function getJsonConfig(): string
    {
        $config = $this->helper->toAdminConfiguration();

        return $this->jsonSerializer->serialize([
            'apiKey' => $config['api_key'] ?? '',
            'postcodeLookup' => false,
            'autocomplete' => (bool)($config['addressAutocomplete'] ?? false),
            'populateCounty' => (bool)($config['requireCounty'] ?? false),
            'removeOrganisation' => (bool)($config['removeOrganisation'] ?? false),
            'hoistCountry' => false,
            'customFields' => $this->parseJsonConfig($config['customFields'] ?? null),
            'enabled' => (bool)($config['enabled'] ?? false)
        ]);
    }

    /**
     * Check if the module is enabled
     *
     * @return bool
     */
    public function isEnabled(): bool
    {
        $config = $this->helper->toAdminConfiguration();
        return (bool)($config['enabled'] ?? false);
    }

    /**
     * Parse JSON string config value into array/object
     *
     * @param string|null $value
     * @return mixed
     */
    private function parseJsonConfig($value)
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return $this->jsonSerializer->unserialize($value);
        } catch (\Exception $e) {
            return null;
        }
    }
}
