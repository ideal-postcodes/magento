(function() {
    'use strict';
    
    var configEl = document.getElementById('idpc-config');
    if (!configEl) return;
    
    try {
        window.idpcConfig = JSON.parse(configEl.getAttribute('data-config'));
    } catch (e) {
        console.error('Ideal Postcodes: Failed to parse config', e);
        return;
    }
    
    var script = document.createElement('script');
    script.src = configEl.getAttribute('data-binding-url');
    script.onload = function() {
        if (typeof window.idpcStart === 'function') {
            window.idpcStart();
        }
    };
    document.head.appendChild(script);
})();
