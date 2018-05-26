(function() {
    'use strict';

    angular
        .module('services.api', [
            'services.api.contacts',
        ])
        .factory('api', api);

    api.$inject = ['api.contacts'];

    function api(contacts) {
        return {
            contacts: contacts,
        };
    }
})();