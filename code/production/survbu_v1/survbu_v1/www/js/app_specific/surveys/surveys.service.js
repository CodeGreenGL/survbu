/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('surveysSrvc', surveysSrvc);

    surveysSrvc.$inject = [
        '$q', // promises service
        '$http', // HTTP service
        '$filter'
    ];

    function surveysSrvc(
        $q,
        $http,
        $filter
    ) {
        //get all surveys from codegreen restlet; returns deferred promise
        var surveysArray = [],
            waitingState = false,
            getAllSurveys = function () {
                var deferred = $q.defer();
                $http({
                    url: 'https://codegreen.restlet.net/v2/surveys/', //'https://codegreen.restlet.net/v2/surveys/',
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==", // SHOULD BE THE version 2 token => OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmExYmZjYTExLWI0ZDEtNGEzZS05YmMxLTk5YzI5ZDFmZTEzMw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    surveysArray = response.data;
                    console.log(surveysArray);
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
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting surveyID');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSurvey = function (survey) {
                console.log("survey in updateSUrvey servces");
                console.log(survey);
                var updatedSurvey,
                    deferred = $q.defer();
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
                    updatedSurvey = response.data;
                    deferred.resolve(updatedSurvey);
                }, function errorCallback(response) {
                    console.error('Error while updating section from survey');
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
                    var survey = {
                        id: survey.id,
                        introductionMessage: survey.introductionMessage,
                        completionMessage: survey.completionMessage,
                        sectionIds: survey.sectionIds
                    };
                    return promiseToUpdateSurvey(survey);
                },
                getSurveys: function () {
                    return angular.copy(surveysArray);
                },
                getNumSurveys: function () {
                    return surveysArray.length;
                },
                getSurveyAt: function (id) {
                    return angular.copy($filter('filter')(surveysArray, {id: id}, true)[0]);
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
