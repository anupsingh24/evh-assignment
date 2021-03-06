(function() {
    'use strict';

    angular
        .module('contacts', [])
        .controller('ContactListCtrl', ContactListCtrl)
        .controller('ContactEditCtrl', ContactEditCtrl);

    ContactListCtrl.$inject = ['api', 'components', '$location', 'Notification'];

    function ContactListCtrl(api, components, $location, Notification) {
        var headers = components.getHeaders(),
            params = {
                content_uid: "contacts",
                locale: "en-us"
            },
            self = this;
        self.loader = true;
        api.contacts.list(params, headers)
            .then(function(data) {
                console.log("entry list", data.entries);
                self.contactList = data.entries;
                self.loader = false;
            }).
        catch(function(error) {
            console.log("entry error", error);
        });

        self.deleteContact = function(uid) {
            self.loader = true;
            params.entry_uid = uid;
            api.contacts.delete(params, headers)
                .then(function(data) {
                    self.contactList = _.without(self.contactList, _.findWhere(self.contactList, {
                      uid: uid
                    }));
                    Notification.success("Contact deleted successfully");
                    self.loader = false;
                })
                .catch(function(error) {
                    console.log("entry error", error);
                    Notification.error(error.error_message);
                    self.loader = false;
                });
        };

        self.createContact = function() {
            $location.path('/contacts/create');
        };

        self.editContactPage = function(uid) {
            $location.path('/contacts/' + uid + '/edit');
        };
    }

    ContactEditCtrl.$inject = ['$stateParams', 'api', 'components', '$location', 'Notification'];

    function ContactEditCtrl($stateParams, api, components, $location, Notification) {
        var headers = components.getHeaders(),
            params = {
                content_uid: "contacts",
                locale: "en-us"
            },
            self = this;
        self.contactInfo = {};
        self.loader = true;
        if ($stateParams.contact_uid) {
            self.isEdit = true;
            params.entry_uid = $stateParams.contact_uid;
            api.contacts.single(params, headers)
                .then(function(data) {
                    console.log("entry info", data.entry);
                    self.contactInfo = data.entry;
                    self.loader = false;
                }).
            catch(function(error) {
                console.log("entry error", error);
                Notification.error("No Contact found");
                self.loader = false;
                $location.path('/contacts/list');
            });
        } else {
            self.loader = false;
            self.contactInfo.status = true;
        }

        self.deleteContact = function() {
            self.loader = true;
            api.contacts.delete(params, headers)
                .then(function(data) {
                    console.log("entry info", data.entry);
                    self.loader = false;
                    Notification.success("Contact deleted successfully");
                    $location.path('/contacts/list');
                }).
            catch(function(error) {
                console.log("entry error", error);
                Notification.error(error.error_message);

            });
        };

        self.saveInfo = function(contactInfo) {
            self.loader = true;
            console.log("saveInfo", contactInfo);
            var info = {
                    entry: {
                        title: contactInfo.title,
                        first_name: contactInfo.first_name,
                        last_name: contactInfo.last_name,
                        number: contactInfo.number,
                        status: contactInfo.status,
                    }
                },
                action = (self.isEdit) ? "update" : "create";

            api.contacts[action](info, params, headers)
                .then(function(data) {
                    console.log('submit data', data);
                    self.loader = false;
                    $location.path('/contacts/list');
                    if (action === 'create') {
                        Notification.success("Contact created successfully");
                    } else {
                        Notification.success("Contact updated successfully");
                    }
                })
                .catch(function(error) {
                    console.log('error log', error);

                    if (action === 'create') {
                        Notification.error("Email id is already registered or Invalid data");
                    } else {
                        Notification.error(error.error_message);
                    }
                    self.loader = false;
                });
        };

        self.gotoList = function() {
            $location.path('/contacts/list');
        };

        self.createContact = function() {
            $location.path('/contacts/create');
        };
    }
})();