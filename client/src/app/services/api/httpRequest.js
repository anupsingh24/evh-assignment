(function(){
    'use strict';

    angular
        .module('services.http', [])
        .factory('httpRequest', httpRequest);

        httpRequest.$inject = ['$http', '$q'];

        function httpRequest($http, $q){
            return {
                getData : getData
            };
            function getData(options) {
                console.log("options",options);
                var url =  'v3/'+options.url;
                options.params = _.extend(options.params || {}, {r: Math.random()});
                return $http({
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
                return $q.reject(err.data);
            }
        }
})();
