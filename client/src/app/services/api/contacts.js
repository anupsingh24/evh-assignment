(function(){
    'use strict';

    angular
        .module('services.api.contacts', [])
        .factory('api.contacts', contacts);
    contacts.$inject = ['httpRequest', '$q'];

    function contacts(httpRequest){
        return {
            list : function(params, headers){
                return httpRequest.getData({method: 'GET', url: "content_types/"+params.content_uid+"/entries", params: params, headers: headers});
            },
            single : function(params, headers){
                return httpRequest.getData({method: 'GET', url: "content_types/"+params.content_uid+"/entries/" + params.entry_uid, params: params.locale, headers: headers});
            },
            create : function(data, params, headers){
                return httpRequest.getData({method: 'POST', url: "content_types/"+params.content_uid+"/entries/", params : params, data: data, headers: headers});
            },
            update : function(data, params, headers){
                return httpRequest.getData({method: 'PUT', url: "content_types/"+params.content_uid+"/entries/" + params.entry_uid,  data: data, headers: headers});
            },
            delete : function(params, headers){
                return httpRequest.getData({method: 'DELETE', url: "content_types/"+params.content_uid+"/entries/" + params.entry_uid, params: params, headers: headers});
            }
        };
    }
})();