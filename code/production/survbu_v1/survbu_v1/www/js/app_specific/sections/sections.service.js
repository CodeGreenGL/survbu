/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('sectionsSrvc', sectionsSrvc);

    sectionsSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function sectionsSrvc(
        $q,
        $http
    ) {
        //get all sections from codegreen restlet; returns deferred promise
        var sectionsArray = [],
            waitingState = true, // Set waitingstate to false so surveys load
            service = {},
            getAllSections = function (surveySections) {
                var deferred = $q.defer();
                if (surveySections.length > 0) {
                    for (var i = 0, len = surveySections.length; i < len; i++) {
                        $http({
                            url: 'https://codegreen.restlet.net/v1/surveySections/' + surveySections[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                                "content-type": "application/json",
                                "accept": "application/json"
                            }
                        }).then(function successCallback(response) {
                            sectionsArray.splice(surveySections.indexOf(response.data['id']), 0, response.data);
                            if (sectionsArray.length == surveySections.length) {
                                deferred.resolve(sectionsArray);
                            }
                        }, function errorCallback(response) {
                            console.error('Error while fetching sections');
                            console.error(response);
                        });
                    }
                } else {
                    deferred.resolve(sectionsArray);
                }
                return deferred.promise;
            };

        var promiseToUpdateSections = function (surveySections) {
            // returns a promise
            return getAllSections(surveySections);
        };

        service.updateSections = function (surveySections) {
            sectionsArray = [];
            return promiseToUpdateSections(surveySections);
        };

        service.getSections = function () {
            return angular.copy(sectionsArray);
        };

        service.getNumSections = function () {
            return sectionsArray.length;
        };

        service.getSectionAt = function (index) {
            return angular.copy(sectionsArray[index]);
        };

        service.isWaiting = function (iWait) {
            waitingState = iWait;
        };

        service.isItWaiting = function () {
            return waitingState;
        };

        // Create a section object
        service.createSectionService = function(sectionHeading,sectionIntroductionMessage) {
            var sectionObject = {
                id : "",
                introductionMessage : sectionIntroductionMessage,
                questionIds : [],
                heading : sectionHeading
            };
            return createSection(sectionObject);
        }

        var createSection = function(sectionObject){
            var addedSections;
            //var deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net:443/v1/surveySections/',
                    data: sectionObject,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    addedSections = response.data;    
                    //Add sections to our sectionArray
                    sectionsArray.push(addedSections);

                    
                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });

                return sectionsArray.length-1;
        }

        return service;

    }
}());
