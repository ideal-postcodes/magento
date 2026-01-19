var config = {
    map: {
        '*': {
            'idealpostcodes_binding': 'Idealpostcodes_Ukaddresssearch/binding.min'
        }
    },
    shim: {
        'Idealpostcodes_Ukaddresssearch/binding.min': {
            exports: 'IdealPostcodes'
        }
    }
};
