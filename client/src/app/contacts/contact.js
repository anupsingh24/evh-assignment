(function() {
    'use strict';

    angular
        .module('contacts', [])
        .controller('ContactListCtrl', ContactListCtrl)
        .controller('ContactEditCtrl', ContactEditCtrl);

    ContactListCtrl.$inject = ['api', 'components', '$location'];

    function ContactListCtrl(api, components, $location) {
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

        self.deleteContact = function(uid, index) {
            self.loader = true;
            params.entry_uid = uid;
            api.contacts.delete(params, headers)
                .then(function(data) {
                    self.contactList.splice(index, 1);
                    console.log(self.contactList, index);
                    self.loader = false;
                }).
            catch(function(error) {
                console.log("entry error", error);
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

    ContactEditCtrl.$inject = ['$stateParams', 'api', 'components', '$location'];

    function ContactEditCtrl($stateParams, api, components, $location) {
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
                self.loader = false;
                $location.path('/contacts/list');
            });
        }else{
            self.loader =false;
        }

        self.deleteContact = function() {
            self.loader = true;
            api.contacts.delete(params, headers)
                .then(function(data) {
                    console.log("entry info", data.entry);
                    self.loader = false;
                    $location.path('/contacts/list');
                }).
            catch(function(error) {
                console.log("entry error", error);
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
                    $location.path('/contacts/' + data.entry.uid + '/edit');
                })
                .catch(function(error) {
                    console.log('error log', error);
                    self.loader = false;
                });
        };

        self.gotoList = function() {
            $location.path('/contacts/list');
        };
    }
})();