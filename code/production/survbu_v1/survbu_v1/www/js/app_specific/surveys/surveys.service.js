/*global angular */
(function () {
    'use strict';

    angular
        .module('surveysjs')
        .factory('surveysSrvc', surveysSrvc);

    surveysSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function surveysSrvc(
        $q,
        $http
    ) {

        var surveysArray = []; //Set up initial values here for debugging

        var service = {};

        //get all surveys from codegreen restlet; returns deferred promise
        var getAllSurveys = function () {
            var deferred = $q.defer();

            $http({
                url: 'https://codegreen.restlet.net/v1/surveys/',
                headers: {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            }).then(function successCallback(response) {
                surveysArray = response.data;
                deferred.resolve(surveysArray);
            }, function errorCallback(response) {
                console.error('Error while fetching notes');
                console.error(response);
            });

            return deferred.promise;
        }

        var promiseToUpdateSurveys = function () {
            // returns a promise
            return getAllSurveys();
        };

        service.updateSurveys = function () {
            return promiseToUpdateSurveys();
        };

        service.getSurveys = function () {
            return angular.copy(surveysArray);
        };

        service.getNumSurveys = function () {
            return surveysArray.length;
        };

        service.getSectionAt = function (index) {
            return angular.copy(surveysArray[index]);
        };

        return service;
    }

}());