(function() {
    'use strict';

    var app = angular.module('evolent', [
        'routes',
        'templates.app',
        'contacts',
        'services',
        'ngSanitize',
        'ui-notification'
    ]);
    app.run(runBlock);
    app.controller('AppCtrl', AppController);
    app.controller('NotFoundController', NotFoundController);

    runBlock.$inject = ['$location'];
    config.$inject = ['NotificationProvider'];

    function runBlock($location) {
        if (!$location.path() || $location.path() === "/") {
            $location.path("/contacts/list");
        }
    }

    AppController.$inject = [];

    function AppController() {
        console.log('Entry Point of app');
    }

    NotFoundController.$inject = [];

    function NotFoundController() {
        console.log("Page not found controller");
    }

    function config(NotificationProvider) {

        NotificationProvider.setOptions({
            delay: 2000,
            startTop: 100,
            startRight: 10,
            verticalSpacing: 20,
            horizontalSpacing: 20,
            positionX: 'right',
            positionY: 'top',
            closeOnClick: false
        });
    }
})();