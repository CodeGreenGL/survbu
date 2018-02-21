/*global angular, console, Promise */
/* eslint-disable no-console */
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
            allQuestionsArray = [],
            remainingQuestionsArray = [],
            waitingState = false,
            getSectionQuestions = function (sectionQuestions) {
                var deferred = $q.defer(),
                    httpPromises = [],
                    i = 0,
                    len;
                if (sectionQuestions.length > 0) { // Only perform requests if there are any in the sectionQuestions array
                    for (len = sectionQuestions.length; i < len; i = i + 1) {
                        httpPromises[i] = $http({
                            url: 'https://codegreen.restlet.net/v1/questions/' + sectionQuestions[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                                "content-type": "application/json",
                                "accept": "application/json"
                            }
                        }).then(function successCallback(response) {
                            // Splice in question at order from sectionQuestions to preserve order, deleting 0 items
                            questionsArray.splice(sectionQuestions.indexOf(response.data.id), 0, response.data); //how about .push here ?? will be in random order every time, not sure if an issue
                            Promise.resolve();
                        }, function errorCallback(response) {
                            console.error('Error while fetching questions');
                            console.error(response);
                        });
                    }
                    Promise.all(httpPromises).then(function () {// Create a promise that completes when all httpPromises have resolved, thereby not blocking the function
                        deferred.resolve(questionsArray);       // resolve the promise 'deferred', to stop "Updating" from being shown on questions list
                    });
                } else { // If no requests have to be performed (empty sectionQuestions), then resolve the empty array that was set from the parent's parent's function
                    deferred.resolve(questionsArray);
                }
                return deferred.promise;
            },
            getAllQuestions = function () {
                var deferred = $q.defer();
                $http({
                    url: 'https://codegreen.restlet.net/v1/questions/',
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    allQuestionsArray = response.data;
                    deferred.resolve(allQuestionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            createQuestion = function (questionObject) {
                var addedQuestion,
                    deferred = $q.defer();

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
            },
            promiseToUpdateQuestions = function (sectionQuestions) {
                // returns a promise
                return getSectionQuestions(sectionQuestions);
            },
            promiseToGetAllQuestions = function () {
                return getAllQuestions();
            },
            promiseToCreateQuestion = function (questionObject) {
                return createQuestion(questionObject);
            },
            removeAlreadyAdded = function () {
                var deferred = $q.defer(),
                    i;
                service.getAllQuestions().then(function () {
                    remainingQuestionsArray = angular.copy(allQuestionsArray);
                    if (questionsArray.length > 0) {
                        for (i = 0; i < questionsArray.length; i = i + 1) {
                            var removeIndex = remainingQuestionsArray.map(function (question) { return question.id; }).indexOf(questionsArray[i].id);
                            remainingQuestionsArray.splice(removeIndex, 1);
                        }
                    }
                    for (i = 0; i < remainingQuestionsArray.length; i = i + 1) {
                        remainingQuestionsArray[i].adding = false;
                    }
                    deferred.resolve(remainingQuestionsArray);
                });
                return deferred.promise;
            },
            service = {
                updateQuestions: function (sectionQuestions) {
                    questionsArray = [];
                    return promiseToUpdateQuestions(sectionQuestions);
                },
                getAllQuestions: function () {
                    allQuestionsArray = [];
                    return promiseToGetAllQuestions();
                },
                getQuestions: function () {
                    return angular.copy(questionsArray);
                },
                returnAllQuestions: function () {
                    return angular.copy(allQuestionsArray);
                },
                getNumQuestions: function () { //this needs reviewing which array length it should return
                    return questionsArray.length;
                },
                getNumAllQuestions: function () {
                    return allQuestionsArray.length;
                },
                disposeQuestions: function () {
                    questionsArray = [];
                },
                getQuestionAt: function (index) {
                    return angular.copy(questionsArray[index]);
                },
                createQuestionService: function (paramType, paramText, paramQuestionChoices) {
                    console.log(paramType);
                    var questionObject = {
                        id: "",
                        questionType: paramType,
                        questionText: paramText,
                        questionChoices: paramQuestionChoices
                    };
                    return promiseToCreateQuestion(questionObject);
                },
                isWaiting: function (iWait) {
                    waitingState = iWait;
                },
                isItWaiting: function () {
                    return waitingState;
                },
                updateRemainingQuestions: function () {
                    return removeAlreadyAdded();
                },
                getRemainingQuestions: function () {
                    return angular.copy(remainingQuestionsArray);
                }
            };
        return service;
    }
}());
