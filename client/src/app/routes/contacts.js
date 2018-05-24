(function() {
    'use strict';

    angular
        .module('routes.contacts', [
            'ui.router'
        ])
        .config(['$stateProvider', function ($stateProvider) {
            $stateProvider
                .state('contacts', {
                    url: '/contacts',
                    abstract: true,
                    views: {
                        'container': {
                            template: '<div ui-view="contact-container">This is my contact container</div>'
                        }
                    }
                })
                .state('contacts.list', {
                    url: '/list',
                    views: {
                        'contact-container': {
                            templateUrl: 'contacts/contact-list.tpl.html',
                            controller: 'ContactListCtrl',
                            controllerAs: 'clist'
                        }
                    }
                })
                .state('contacts.edit', {
                    url: '/:contact_uid/edit',
                    views: {
                        'contact-container': {
                            templateUrl: 'contacts/contact-edit.tpl.html',
                            controller: 'ContactEditCtrl',
                            controllerAs: 'cedit'
                        }
                    }
                })
                .state('contacts.create', {
                    url: '/create',
                    views: {
                        'contact-container': {
                            templateUrl: 'contacts/contact-edit.tpl.html',
                            controller: 'ContactEditCtrl',
                            controllerAs: 'cedit'                        
                        }
                    }
                });
                
        }]);
})();