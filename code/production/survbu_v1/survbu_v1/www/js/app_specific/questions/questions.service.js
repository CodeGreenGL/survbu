/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('questionsSrvc', questionsSrvc);

    questionsSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function questionsSrvc(
        $q,
        $http
    ) {
        //get all surveys from codegreen restlet; returns deferred promise
        var questionsArray = [],
            waitingState = true,
            service = {},
            getAllQuestions = function (sectionQuestions) {
                var deferred = $q.defer();
                if (sectionQuestions.length > 0) {
                    for (var i = 0, len = sectionQuestions.length; i < len; i++) {
                        $http({
                            url: 'https://codegreen.restlet.net/v1/questions/' + sectionQuestions[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                                "content-type": "application/json",
                                "accept": "application/json"
                            }  
                        }).then(function successCallback(response) {
                        // Splice in question at order from sectionQuestions to preserve order, deleting 0 items
                            questionsArray.splice(sectionQuestions.indexOf(response.data['id']), 0, response.data);
                            if (questionsArray.length == sectionQuestions.length) {
                                deferred.resolve(questionsArray);
                            }
                        }, function errorCallback(response) {
                            console.error('Error while fetching questions');
                            console.error(response);
                        });
                    } 
                } else {
                        deferred.resolve(questionsArray);
                    }
                return deferred.promise;
            };

        var promiseToUpdateQuestions = function (sectionQuestions) {
            // returns a promise
            return getAllQuestions(sectionQuestions);
        };

        service.updateQuestions = function (sectionQuestions) {
            questionsArray = [];
            return promiseToUpdateQuestions(sectionQuestions);
        };

        service.getQuestions = function () {
            return angular.copy(questionsArray);
        };

        service.getNumQuestions = function () {
            return questionsArray.length;
        };

        service.getQuestionAt = function (index) {
            return angular.copy(questionsArray[index]);
        };

        service.isWaiting = function (iWait) {
            waitingState = iWait;
        };

        service.isItWaiting = function () {
            return waitingState;
        };

        service.createQuestionService = function(questionText, questionType, questionChoices) {
            var questionObject = {
                id : "",
                questionType : questionType,
                questionText : questionText,
                questionChoices : questionChoices
            };
            return promiseToCreateQuestion(questionObject);
        };

        var promiseToCreateQuestion = function(questionObject){
            return createQuestion(questionObject);
        };

        var createQuestion = function(questionObject){
            var addedQuestion;
            var deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net:443/v1/questions/',
                    data: questionObject,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    addedQuestion = response.data;    
                    //Add sections to our sectionArray
                    questionsArray.push(addedQuestion);
                    deferred.resolve(addedQuestion);

                    
                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });

                return deferred.promise;
        };

        return service;
    }
}());
