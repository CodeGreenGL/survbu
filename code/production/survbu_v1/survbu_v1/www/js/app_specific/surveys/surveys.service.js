/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('surveysSrvc', surveysSrvc);

    surveysSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function surveysSrvc(
        $q,
        $http
    ) {
        //get all surveys from codegreen restlet; returns deferred promise
        var surveysUrl = "https://codegreen.restlet.net/v2/surveys/",
            surveysArray = [],
            waitingState = false,
            getAllSurveys = function () {
                var deferred = $q.defer();
                $http.get(surveysUrl).then(function successCallback(response) {
                    surveysArray = response.data;
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching all surveys');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteSurveyID = function (surveyID) {
                var deferred = $q.defer();
                $http.delete(surveysUrl + surveyID).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting surveyID');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSurvey = function (localSurvey) {
                var deferred = $q.defer();
                console.log(localSurvey.id);
                $http.put(surveysUrl + localSurvey.id, localSurvey).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while updating survey!');
                    console.error(response);
                });
                return deferred.promise;
            },
            createSurvey = function (surveyObject) {
                var deferred = $q.defer(),
                    addedSurvey;

                $http.post(surveysUrl, surveyObject).then(function successCallback(response) {
                    addedSurvey = response.data;
                    //Add the survey to our surveyArray               
                    surveysArray.push(addedSurvey);
                    deferred.resolve(addedSurvey);

                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });
                return deferred.promise;
            },
            service = {
                updateAllSurveys: function () {
                    surveysArray = [];
                    return getAllSurveys();
                },
                deleteSurvey: function (surveyID) {
                    return deleteSurveyID(surveyID);
                },
                updateSurvey: function (survey) {
                    return updateSurvey(survey);
                },
                getSurveys: function () {
                    return angular.copy(surveysArray);
                },
                getNumSurveys: function () {
                    return surveysArray.length;
                },
                getSurveyAt: function (surveyID) {
                    //_.find(surveysArray, ['id', surveyID])); Lodash equivalent
                    return surveysArray.find(survey => survey.id == surveyID);
                },
                createSurvey: function (surveyObject) {
                    return createSurvey(surveyObject);
                },
                isWaiting: function (iWait) {
                    waitingState = iWait;
                },
                isItWaiting: function () {
                    return waitingState;
                }
            };
        return service;
    }
}());
