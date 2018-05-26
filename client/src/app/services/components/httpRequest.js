(function() {
    'use strict';

    angular
        .module('services.http', [])
        .factory('httpRequest', httpRequest);

    httpRequest.$inject = ['$http', '$q', '$rootScope', '$location'];

    function httpRequest($http, $q, $rootScope, $location) {
        return {
            getData: getData
        };

        function getData(options) {
            console.log("options", options);
            var url = 'v3/' + options.url;
            options.params = _.extend(options.params || {}, { r: Math.random() });
            options.headers = _.extend(options.headers || {}, { "Content-Type": "application/json" });
            return $http({
                    method: options.method,
                    url: url,
                    headers: options.headers,
                    data: options.data || {},
                    params: options.params
                })
                .then(success)
                .catch(error);
        }

        function success(res) {
            console.log("res in http", res);
            return res.data;
        }

        function error(err) {
            console.log("err in http", err);
            return $q.reject(err.data);
        }
    }
})();