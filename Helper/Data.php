<?php
namespace Idealpostcodes\Ukaddresssearch\Helper;

use Magento\Framework\App\Helper\AbstractHelper;
use Magento\Framework\App\Helper\Context;
use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Framework\Encryption\EncryptorInterface;
use Magento\Framework\View\Asset\Repository;
use Magento\Store\Model\ScopeInterface;
use Magento\Store\Model\StoreManagerInterface;

class Data extends AbstractHelper /** * @var EncryptorInterface */
{
    protected $encryptor;
    protected $repository;
    protected $storeManager;
    /** * @param Context $context * @param EncryptorInterface $encryptor * @param Repository $repository */


    public function __construct(Context $context, EncryptorInterface $encryptor, Repository $repository, StoreManagerInterface $storeManager)
    {
        parent::__construct($context);
        $this->encryptor = $encryptor;
        $this->repository = $repository;
        $this->storeManager = $storeManager;
    }

    public function getStoreId() {
    	return $this->storeManager->getStore()->getId();
    }

    public function isEnabled($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/enabled',
            $scope,
            $storeId
        );
    }

    public function isEnabledAdminAutocomplete($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/admin_autocomplete',
            $scope,
            $storeId
        );
    }

    public function getApiKey($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/api_key',
            $scope,
            $storeId
        );
        return $apiKey;
    }

    public function getCheckoutTargets($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/checkout_targets',
            $scope,
            $storeId
        );
        return $apiKey;
    }

    public function getCustomerAddressTarget($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/customer_address_target',
            $scope,
            $storeId
        );
        return $apiKey;
    }

    public function getMultishippingCheckoutTargets($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/multishipping_checkout_targets',
            $scope,
            $storeId
        );
        return $apiKey;
    }

    public function getMultishippingCheckoutRegisterTarget($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null)
    {
        $apiKey = $this->scopeConfig->getValue(
            'idealpostcodes/settings/multishipping_checkout_register_target',
            $scope,
            $storeId
        );
        return $apiKey;
    }

    public function getUserToken(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        $userToken = $this->scopeConfig->getValue(
            'idealpostcodes/settings/user_token',
            $scope,
            $storeId
        );
        return $userToken;
    }

    public function getAutocompleteOverride(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->getValue(
            'idealpostcodes/settings/autocomplete_override',
            $scope,
            $storeId
        );
    }

    public function getPostcodeLookupOverride(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->getValue(
            'idealpostcodes/settings/postcode_lookup_override',
            $scope,
            $storeId
        );
    }

    public function usesPostcodeLookup(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/postcode_lookup',
            $scope,
            $storeId
        );
    }

    public function usesAutocomplete(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/autocomplete',
            $scope,
            $storeId
        );
    }

    public function removeOrganisation(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/remove_organisation_store',
            $scope,
            $storeId
        );
    }

    public function removeOrganisationAdmin(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/remove_organisation_admin',
            $scope,
            $storeId
        );
    }

    public function requireCounty(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/require_county',
            $scope,
            $storeId
        );
    }

    public function hoistCountry(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        return $this->scopeConfig->isSetFlag(
            'idealpostcodes/settings/hoist_country',
            $scope,
            $storeId
        );
    }

    public function customFields($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null) {
        return $this->scopeConfig->getValue(
            'idealpostcodes/settings/custom_fields',
            $scope,
            $storeId
        );
    }

    public function checkoutOnly($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null) {
    	return $this->scopeConfig->isSetFlag(
			'idealpostcodes/settings/checkout_only',
			$scope,
			$storeId
		);
    }

    public function matchCheckout($scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null) {
		return $this->scopeConfig->getValue(
			'idealpostcodes/settings/match_checkout_page',
			$scope,
			$storeId
		);
	}

    public function toConfiguration(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT, $storeId = null
    ) {
        $config = array(
            'enabled' => $this->isEnabled($scope, $storeId),
            'api_key' => $this->getApiKey($scope, $storeId),
            'postcodeLookup' => $this->usesPostcodeLookup($scope, $storeId),
            'addressAutocomplete' => $this->usesAutocomplete($scope, $storeId),
            'removeOrganisation' => $this->removeOrganisation($scope, $storeId),
            'hoistCountryField' => $this->hoistCountry($scope, $storeId),
            'requireCounty' => $this->requireCounty($scope, $storeId),
            'autocompleteOverride' => $this->getAutocompleteOverride($scope, $storeId),
            "postcodeLookupOverride" => $this->getPostcodeLookupOverride($scope, $storeId),
            "customFields" => $this->customFields($scope, $storeId),
            "checkoutOnly" => $this->checkoutOnly($scope, $storeId),
            "matchCheckout" => $this->matchCheckout($scope, $storeId),
        );
        return $config;
    }

    public function toAdminConfiguration(
        $scope = ScopeConfigInterface::SCOPE_TYPE_DEFAULT
    ) {
        $config = array(
            'enabled' => $this->isEnabled($scope),
            'api_key' => $this->getApiKey($scope),
            'addressAutocomplete' => $this->isEnabledAdminAutocomplete($scope),
            'removeOrganisation' => $this->removeOrganisationAdmin($scope),
            'hoistCountryField' => $this->hoistCountry($scope),
            'requireCounty' => $this->requireCounty($scope),
            "customFields" => $this->customFields($scope),
        );
        return $config;
    }

    public function getConfig($field) {
        $config = $this->toConfiguration(ScopeInterface::SCOPE_STORE);
        return is_bool($config[$field]) ? ($config[$field] ? 'true' : 'false') : $config[$field];
    }

    public function getAdminConfig($field) {
        $config = $this->toAdminConfiguration();
        return is_bool($config[$field]) ? ($config[$field] ? 'true' : 'false') : $config[$field];
    }

    public function getFileUrl($file) {
        $asset = $this->repository->createAsset("Idealpostcodes_Ukaddresssearch::$file");
        return $asset->getUrl();
    }
}
