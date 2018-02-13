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
            waitingState = false, // Set waitingstate to false so surveys load
            service = {},
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
                    console.error('Error while fetching notes');
                    console.error(response);
                });
                
                return deferred.promise;
            };

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

        service.getSurveyAt = function (index) {
            return angular.copy(surveysArray[index]);
        };
        
        service.isWaiting = function (iWait) {
            waitingState = iWait;
        };

        service.isItWaiting = function () {
            return waitingState;
        };

        // Create a survey object
        service.createSurveyService = function(surveyTitle,surveyDescription) {
            var surveyObject = {
                id : "",
                introductionMessage : surveyTitle,
                completionMessage : surveyDescription,
                sectionIds : []
            };
            return promiseToCreateSurvey(surveyObject);
        };

        var promiseToCreateSurvey = function(surveyObject){
            return createSurvey(surveyObject);
        };

        var createSurvey = function(surveyObject){
            var addedSurvey;
            var deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net/v1/surveys/',
                    data: surveyObject,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
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
            
        }


        service.updateSurveyDetails = function(survey){
            return updateSurveyDetailsSections(survey);
        };

        var updateSurveyDetailsSections = function(survey){
            var deferred = $q.defer();
            var surveyId = survey['id'];

            $http({
                method: "PUT",
                url: 'https://codegreen.restlet.net:443/v1/surveys/' + surveyId,
                data: survey,
                headers: {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            }).then(function successCallback(response) {

                deferred.resolve(response.data);
                
            }, function errorCallback(response) {
                console.error('Error while fetching notes');
                console.error(response);
            });
                
            return deferred.promise;
        };


        return service;
    }

}());
