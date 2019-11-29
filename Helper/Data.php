<?php
namespace Idealpostcodes\Ukaddresssearch\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Encryption\EncryptorInterface;

class Data extends AbstractHelper /** * @var EncryptorInterface */
{
    protected $encryptor; /** * @param Context $context * @param EncryptorInterface $encryptor */

    public function __construct(Context $context, EncryptorInterface $encryptor)
    {
        parent::__construct($context);
        $this->encryptor = $encryptor;
    }

    public function isEnabled($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT)
    {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/enabled',
            $scope
        );
    }

    public function getApiKey($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/api_key',
            $scope
        );
        return $apiKey;
    }

    public function getUserToken(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        $userToken = $this->scopeConfig->getValue(
            'idealpostcodes/settings/user_token',
            $scope
        );
        return $userToken;
    }

    public function usesPostcodeLookup(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/postcode_lookup',
            $scope
        );
    }

    public function usesAutocomplete(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/autocomplete',
            $scope
        );
    }

    public function populateOrganisation(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/populate_organisation',
            $scope
        );
    }

    public function requireCounty(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/require_county',
            $scope
        );
    }

    public function hoistCountry(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/hoist_country',
            $scope
        );
    }

    public function toConfiguration(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        $config = array(
            'enabled' => $this->isEnabled($scope),
            'api_key' => $this->getApiKey($scope),
            'postcodeLookup' => $this->usesPostcodeLookup($scope),
            'addressAutocomplete' => $this->usesAutocomplete($scope),
            'populateOrganisation' => $this->populateOrganisation($scope),
            'hoistCountryField' => $this->hoistCountry($scope),
            'requireCounty' => $this->requireCounty($scope)
        );
        return $config;
    }

    public function getConfig($field) {
        $config = $this->toConfiguration();
        return is_bool($config[$field]) ? ($config[$field] ? 'true' : 'false') : $config[$field];
    }
}
