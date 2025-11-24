<?php
namespace Idealpostcodes\Ukaddresssearch\ViewModel;

use Idealpostcodes\Ukaddresssearch\Helper\Data;
use Magento\Framework\View\Element\Block\ArgumentInterface;

class AdminConfig implements ArgumentInterface
{
    /**
     * @var Data
     */
    private $helper;

    public function __construct(Data $helper)
    {
        $this->helper = $helper;
    }

    public function getAdminConfig($field)
    {
        return $this->helper->getAdminConfig($field);
    }
}
