/*global angular, console */
/* eslint no-console: 0*/
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
                $http.delete(surveysUrl + surveyID).then(function successCallback() {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting surveyID');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSurvey = function (localSurvey) {
                var updatedSurvey,
                    deferred = $q.defer();
                $http.put(surveysUrl + localSurvey.id, localSurvey).then(function successCallback(response) {
                    updatedSurvey = response.data;
                    deferred.resolve(updatedSurvey);
                }, function errorCallback(response) {
                    console.error('Error while updating section from survey');
                    console.error(response);
                });
                return deferred.promise;
            },
            createSurvey = function (surveyObject) {
                var addedSurvey,
                    deferred = $q.defer();
                $http.post(surveysUrl, surveyObject).then(function successCallback(response) {
                    addedSurvey = response.data;
                    //Add the survey to our surveyArray               
                    surveysArray.push(addedSurvey);
                    deferred.resolve(addedSurvey);
                }, function errorCallback(response) {
                    console.error('Error while creating survey');
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
                    var surveyObject = {
                        id: survey.id,
                        introductionMessage: survey.introductionMessage,
                        completionMessage: survey.completionMessage,
                        sectionIds: survey.sectionIds
                    };
                    return updateSurvey(surveyObject);
                },
                getSurveys: function () {
                    return angular.copy(surveysArray);
                },
                getNumSurveys: function () {
                    return surveysArray.length;
                },
                getSurveyAt: function (surveyID) {
                    return surveysArray.find(function (survey) {
                        return survey.id === surveyID;
                    });
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
