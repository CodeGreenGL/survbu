/*global angular */
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
        var surveysArray = [],
            waitingState = false,
            getAllSurveys = function () {
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
                    console.error('Error while fetching all surveys');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteSurveyID = function (surveyID) { //pass an object ??
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: 'https://codegreen.restlet.net/v1/surveys/' + surveyID, //change to survey.id??
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting surveyID');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSurvey = function (survey) {
                var deferred = $q.defer();
                console.log(survey.id);
                $http({
                    method: 'PUT',
                    url: 'https://codegreen.restlet.net/v1/surveys/' + survey.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    data: survey
                }).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section from survey');
                    console.error(response);
                });
                return deferred.promise;
            },
            createSurvey = function (survey) {
                var addedSurvey,
                    deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net/v1/surveys/',
                    data: survey,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
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
            promiseToUpdateAllSurveys = function () {
                // returns a promise
                return getAllSurveys();
            },
            promiseToDeleteSurveyID = function (surveyID) {
                // returns a promise
                return deleteSurveyID(surveyID);
            },
            promiseToUpdateSurvey = function (survey) {
                // returns a promise
                return updateSurvey(survey);
            },
            promiseToCreateSurvey = function (survey) {
                return createSurvey(survey);
            },
            service = {
                updateAllSurveys: function () {
                    surveysArray = [];
                    return promiseToUpdateAllSurveys();
                },
                deleteSurvey: function (surveyID) {
                    return promiseToDeleteSurveyID(surveyID);
                },
                updateSurvey: function (survey) {
                    return promiseToUpdateSurvey(survey);
                },
                getSurveys: function () {
                    return angular.copy(surveysArray);
                },
                getNumSurveys: function () {
                    return surveysArray.length;
                },
                getSurveyAt: function (index) {
                    return angular.copy(surveysArray[index]);
                },
                createSurvey: function (introMessage, completionMessage) {
                    var survey = {
                        id: "",
                        introductionMessage: introMessage,
                        completionMessage: completionMessage,
                        sectionIds: []
                    };
                    return promiseToCreateSurvey(survey);
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
