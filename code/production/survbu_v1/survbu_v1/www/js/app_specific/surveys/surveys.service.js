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
            currentSurvey,
            waitingState = false, // Set waitingstate to false so surveys load
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
            deleteSurveyID = function (surveyID) {
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: 'https://codegreen.restlet.net/v1/surveys/' + surveyID,
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
            updateSurvey = function (localSurvey) {
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: 'https://codegreen.restlet.net/v1/surveys/' + localSurvey.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    data: localSurvey
                }).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section from survey');
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
            promiseToUpdateSurvey = function (localSurvey) {
                // returns a promise
                return updateSurvey(localSurvey);
            },
            service = {
                updateAllSurveys: function () {
                    surveysArray = [];
                    return promiseToUpdateAllSurveys();
                },
                deleteSurvey: function (surveyID) {
                    return promiseToDeleteSurveyID(surveyID);
                },
                updateSurvey: function (sectionID) {
                    var localSurvey = surveysArray[currentSurvey];
                    localSurvey.sectionIds.splice(localSurvey.sectionIds.indexOf(sectionID), 1);
                    surveysArray[currentSurvey] = localSurvey;

                    return promiseToUpdateSurvey(localSurvey);
                },
                setCurrentSurvey: function (index) {
                    currentSurvey = parseInt(index, 10);
                },
                getSurveys: function () {
                    return angular.copy(surveysArray);
                },
                getNumSurveys: function () {
                    return surveysArray.length;
                },
                disposeSurveys: function () {
                    surveysArray = [];
                },
                getSurveyAt: function (index) {
                    return angular.copy(surveysArray[index]);
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
