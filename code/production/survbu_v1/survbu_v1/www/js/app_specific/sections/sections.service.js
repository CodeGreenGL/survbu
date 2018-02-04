(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .factory('sectionsSrvc', sectionsSrvc);

    sectionsSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function sectionsSrvc(
        $q,
        $http
    ) {

        var sectionsArray = [];

        var service = { };
       
        //get all sections from codegreen restlet; returns deferred promise
        var getAllSections = function(){
            var deferred = $q.defer();

            $http({
                url: 'https://codegreen.restlet.net/v1/surveySections/',
                headers : {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                    "content-type": "application/json",
                    "accept": "application/json",
                }
            }).then(function successCallback(response) {
                sectionsArray = response.data;
                deferred.resolve(sectionsArray);
            }, function errorCallback(response) {
                console.error('Error while fetching notes');
                console.error(response);
            });
            
            return deferred.promise;
        }

        var promiseToUpdateSections = function(){
            // returns a promise
            return getAllSections();
        }

        service.updateSections = function(){
            sectionsArray = [];
            return promiseToUpdateSections();   
        } 

        service.getSections = function(){
            return angular.copy(sectionsArray);
        }

        service.getNumSections = function(){
            return sectionsArray.length;
        }

        service.getSectionAt = function(index){
            return angular.copy(sectionsArray[index]);
        }


        return service;

    }

    
})();
