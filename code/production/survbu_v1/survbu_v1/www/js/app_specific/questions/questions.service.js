/*global angular, console */
/* eslint-disable no-console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('questionsSrvc', questionsSrvc);

    questionsSrvc.$inject = [
        '$q', // promises service
        '$http', // HTTP service
        '$filter'
    ];

    function questionsSrvc(
        $q,
        $http,
        $filter
    ) {
        //get all surveys from codegreen restlet; returns deferred promise
        var questionsArray = [],
            allQuestionsArray = [],
            remainingQuestionsArray = [],
            waitingState = false,
            getSectionQuestions = function (sectionQuestions) {
                var deferred = $q.defer();
                if (sectionQuestions.length > 0) {
                    for (var i = 0; i < sectionQuestions.length; i++) {
                        $http({
                            url: 'https://codegreen.restlet.net/v2/questions/' + sectionQuestions[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                                "content-type": "application/json",
                                "accept": "application/json"
                            }
                        }).then(function successCallback(response) {
                            // Splice in question at order from sectionQuestions to preserve order, deleting 0 items
                            questionsArray.splice(sectionQuestions.indexOf(response.data.id), 0, response.data); //how about .push here ??
                            if (questionsArray.length === sectionQuestions.length) {
                                deferred.resolve(questionsArray); // could/should this be moved after 'for' loop ??
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
            },
            getAllQuestions = function () {
                var deferred = $q.defer();
                $http({
                    url: 'https://codegreen.restlet.net/v2/questions/',
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    allQuestionsArray = response.data;
                    deferred.resolve(allQuestionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching all questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            createQuestion = function (question) {
                var addedQuestion,
                    deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net:443/v2/questions/',
                    data: question,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    addedQuestion = response.data;
                    //Add sections to our sectionArray
                    questionsArray.push(addedQuestion);
                    deferred.resolve(addedQuestion);
                    
                }, function errorCallback(response) {
                    console.error('Error creating question');
                    console.error(response);
                });

                return deferred.promise;
            },
            updateQuestion = function(question){
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: 'https://codegreen.restlet.net/v2/questions/' + question.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    data: question
                }).then(function successCallback(response) {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while updating question');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteQuestion = function(question){
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: 'https://codegreen.restlet.net/v2/questions/' + question.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting question');
                    console.error(response);
                });
                return deferred.promise;
            },
            promiseToUpdateQuestions = function (sectionQuestions) {
                return getSectionQuestions(sectionQuestions);
            },
            promiseToUpdateQuestion = function(question){
                return updateQuestion(question);
            },
            promiseToGetAllQuestions = function () {
                return getAllQuestions();
            },
            promiseToCreateQuestion = function (question) {
                return createQuestion(question);
            },
            promiseToDeleteQuestion = function (question) {
                return deleteQuestion(question);
            },
            removeAlreadyAdded = function () {
                var deferred = $q.defer();
                service.getAllQuestions().then(function () {
                    remainingQuestionsArray = angular.copy(allQuestionsArray);
                    if (questionsArray.length > 0) {
                        for (var i = 0; i < questionsArray.length; i = i + 1) {
                            var removeIndex = remainingQuestionsArray.map(function (question) { return question.id; }).indexOf(questionsArray[i].id);
                            remainingQuestionsArray.splice(removeIndex, 1);
                        }
                    }
                    for (var i = 0; i < remainingQuestionsArray.length; i = i + 1) {
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
                updateQuestion: function(question) {
                    var question = {
                        id: question.id,
                        questionType: question.questionType,
                        questionText: question.questionText,
                        questionChoices: question.questionChoices,
                        referenceCount: question.referenceCount
                    };
                    return promiseToUpdateQuestion(question);
                },
                deleteQuestion: function(question) {
                    return promiseToDeleteQuestion(question);
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
                getNumQuestions: function () {
                    return questionsArray.length;
                },
                getNumAllQuestions: function () {
                    return allQuestionsArray.length;
                },
                getQuestionAt: function (id) {
                    return angular.copy($filter('filter')(questionsArray, {id: id}, true)[0]);
                },
                getQuestionAtGlobal: function (id) {
                    return angular.copy($filter('filter')(allQuestionsArray, {id: id}, true)[0]);
                },
                createQuestionService: function (question){
                    var question = {
                        id: "",
                        questionType: question.questionType,
                        questionText: question.questionText,
                        questionChoices: question.questionChoices,
                        referenceCount: question.referenceCount
                    };
                    return promiseToCreateQuestion(question);
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
