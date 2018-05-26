(function() {
    'use strict';

    angular
        .module('services.components', [])
        .factory('components', Components);

    function Components() {
        return {
            getHeaders: getHeaders
        };

        function getHeaders() {
            var headers = {
                authtoken: "blt8dac0df052b5abc6",
                api_key: "bltff37180b56d050c7",
                'Content-Type': "application/json"
            };
            return headers;
        }
    }
})();