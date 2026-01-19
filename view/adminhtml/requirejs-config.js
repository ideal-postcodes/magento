var config = {
    map: {
        '*': {
            'idealpostcodes_admin': 'Idealpostcodes_Ukaddresssearch/admin.min'
        }
    },
    shim: {
        'Idealpostcodes_Ukaddresssearch/admin.min': {
            exports: 'IdealPostcodes'
        }
    }
};
