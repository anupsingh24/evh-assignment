(function(){
    'use strict';

    angular
        .module('services.http', [])
        .factory('httpRequest', httpRequest);

        httpRequest.$inject = ['$http', '$q', '$rootScope', '$location'];

        function httpRequest($http, $q, $rootScope, $location){
            return {
                getData : getData
            };
            function getData(options) {
                console.log("options",options);
                var url =  'v3/'+options.url;
                options.params = _.extend(options.params || {}, {r: Math.random()});
                options.headers = _.extend(options.headers || {}, {"Content-Type" : "application/json"});
                return $http({
                    // ignoreLoadingBar: options.params.ignoreLoadingBar || (options.data && options.data.ignoreLoadingBar) || false,
                    method: options.method,
                    url: url,
                    headers: options.headers,
                    data: options.data || {},
                    params:options.params
                })
                .then(success)
                .catch(error);
            }
            function success(res){
                console.log("res in http", res);
                return res.data;
            }
            function error(err){
                console.log("err in http", err);
                // if(!(err.status >= 400 && err.status < 500)) {
                //     window.trackJs.track(err.config.method + " " + err.status + " " + err.statusText + ": " + err.config.url);
                // }
                // if((err.status === 401 || err.error_code === 105)) {
                //     $rootScope.$broadcast("$clearSession", err);
                // } 
                return $q.reject(err.data);
            }
        }
})();
