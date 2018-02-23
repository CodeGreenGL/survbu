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
        var surveysUrl = "https://codegreen.restlet.net/v2/surveys/",
            configObject = {
                headers: {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            },
            surveysArray = [],
            currentSurvey,
            waitingState = false, // Set waitingstate to false so surveys load
            getAllSurveys = function () {
                var deferred = $q.defer();
                $http.get(surveysUrl, configObject).then(function successCallback(response) {
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
                $http.delete(surveysUrl + surveyID, configObject).then(function successCallback(response) {
                    deferred.resolve(surveysArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting surveyID');
                    console.error(response);
                });
                return deferred.promise;
            },
            putSurvey = function (surveyObject) {
                var deferred = $q.defer();
                console.log(surveyObject.id);
                $http.put(surveysUrl + surveyObject.id, surveyObject, configObject).then(function successCallback(response) {
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

                $http.post(surveysUrl, surveyObject, configObject).then(function successCallback(response) {
                    addedSurvey = response.data;
                    //Add the survey to our surveyArray               
                    surveysArray.push(addedSurvey);

                    //console.log("RESPONSE DATA ID IS :");
                    //console.log(addedSurvey.id);
                    deferred.resolve(addedSurvey);

                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });

                //console.log(surveysArray);       
                //return surveysArray.length-1;
                return deferred.promise;
            },
            service = {
                updateAllSurveys: function () {
                    surveysArray = [];
                    // returns a promise
                    return getAllSurveys();
                },
                deleteSurvey: function (surveyID) {
                    // returns a promise
                    return deleteSurveyID(surveyID);
                },
                updateSurvey: function (sectionID) {
                    var localSurvey = surveysArray[currentSurvey];
                    localSurvey.sectionIds.splice(localSurvey.sectionIds.indexOf(sectionID), 1);
                    surveysArray[currentSurvey] = localSurvey;

                    // returns a promise
                    return putSurvey(localSurvey);
                },
                putSurvey: function (surveyObject) {
                    // returns a promise
                    return putSurvey(surveyObject);
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
                createSurveyService: function (surveyTitle, surveyDescription) {
                    var surveyObject = {
                        id: "",
                        introductionMessage: surveyTitle,
                        completionMessage: surveyDescription,
                        sectionIds: []
                    };
                    // returns a promise
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
