(function() {
    'use strict';

    angular
        .module('routes', [
            'ui.router',
            'routes.contacts'
        ])
        .config(['$locationProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider, $stateProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(false).hashPrefix('!');
            console.log("routing",$stateProvider);
            $stateProvider
                .state('404', {
                    url : '*path',
                    views: {
                        'container': {
                            templateUrl: '404.tpl.html',
                            controller: 'NotFoundController',
                            controllerAs: 'notfound'
                        }
                    }
                });
                
        }]);
})();