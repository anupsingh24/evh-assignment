(function() {
    'use strict';

    var app = angular.module('evolent', [
        'routes',
        'templates.app',
        'contacts',
        'services',
        'ngSanitize'
    ]);
    app.run(runBlock);
    app.controller('AppCtrl', AppController);
    app.controller('NotFoundController', NotFoundController);

    runBlock.$inject = ['$rootScope', '$state', '$stateParams', '$location'];

    function runBlock($rootScope, $state, $stateParams, $location) {
        if (!$location.path() || $location.path() === "/") {
            $location.path("/contacts/list");
        }

        $rootScope.$on('$stateChangeError', function(event) {
            console.log("$stateChangeError");
            $state.go('404');
        });
    }

    AppController.$inject = ['$stateParams'];

    function AppController($stateParams) {
        console.log('$stateParams', $stateParams);

    }

    NotFoundController.$inject = ['$stateParams'];

    function NotFoundController($stateParams) {
        console.log("not found controller");
    }
})();