/*global angular, console */
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
        var questionsUrl = "https://codegreen.restlet.net/v2/questions/",
            questionsArray = [],
            allQuestionsArray = [],
            remainingQuestionsArray = [],
            waitingState = false,
            getSectionQuestions = function (sectionQuestions) {
                var deferred = $q.defer(),
                    httpPromises = [];
                if (sectionQuestions.length > 0) { // Only perform requests if there are any in the sectionQuestions array
                    for (var i = 0, len = sectionQuestions.length; i < len; i = i + 1) { // Keep len variable, otherwise it checks length every iteration
                        httpPromises[i] = $http.get(questionsUrl + sectionQuestions[i]).then(function successCallback(response) {
                            questionsArray.splice(sectionQuestions.indexOf(response.data.id), 0, response.data);
                        }, function errorCallback(response) {
                            console.error('Error ' + response.status + ' while fetching questions');
                            console.error(response);
                        });
                    }
                    $q.all(httpPromises).then(function () { // Create a promise that completes when all httpPromises have resolved, thereby not blocking the function
                        deferred.resolve(questionsArray); // resolve the promise 'deferred', to stop "Updating" from being shown on questions list
                    });
                } else { // If no requests have to be performed (empty sectionQuestions), then resolve the empty array that was set from the parent's parent's function
                    deferred.resolve(questionsArray);
                }
                return deferred.promise;
            },
            getAllQuestions = function () {
                var deferred = $q.defer();
                $http.get(questionsUrl).then(function successCallback(response) {
                    allQuestionsArray = response.data;
                    deferred.resolve(allQuestionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching all questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            postQuestion = function (questionObject) {
                var addedQuestion,
                    deferred = $q.defer();

                $http.post(questionsUrl, questionObject).then(function successCallback(response) {
                    addedQuestion = response.data;
                    //Add sections to our sectionArray
                    allQuestionsArray.push(addedQuestion);
                    questionsArray.push(addedQuestion);

                    deferred.resolve(addedQuestion);
                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });

                return deferred.promise;
            },
            updateQuestion = function (questionObject) {
                var deferred = $q.defer();
                $http.put(questionsUrl + questionObject.id, questionObject).then(function successCallback(response) {
                    deferred.resolve(response);
                }, function errorCallback(response) {
                    console.error('Error while updating question');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteQuestion = function (questionID) {
                var deferred = $q.defer();
                $http.delete(questionsUrl + questionID).then(function successCallback() {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting question');
                    console.error(response);
                });
                return deferred.promise;
            },
            removeAlreadyAdded = function () {
                var i,
                    deferred = $q.defer();
                service.getAllQuestions().then(function () {
                    remainingQuestionsArray = angular.copy(allQuestionsArray);
                    if (questionsArray.length > 0) {
                        for (i = 0; i < questionsArray.length; i = i + 1) {
                            var removeIndex = remainingQuestionsArray.map(function (question) {
                                return question.id;
                            }).indexOf(questionsArray[i].id);
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
                    return getSectionQuestions(sectionQuestions);
                },
                updateQuestion: function (question) {
                    var questionObject = {
                        id: question.id,
                        questionType: question.questionType,
                        questionText: question.questionText,
                        questionChoices: question.questionChoices,
                        referenceCount: question.referenceCount
                    };
                    return updateQuestion(questionObject);
                },
                deleteQuestion: function (question) {
                    return deleteQuestion(question);
                },
                getAllQuestions: function () {
                    allQuestionsArray = [];
                    return getAllQuestions();
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
                getQuestionAt: function (questionId) {
                    return questionsArray.find(function (question) {
                        return question.id == questionId;
                    });
                },
                getQuestionAtGlobal: function (questionId) {
                    return allQuestionsArray.find(function (question) {
                        return question.id == questionId;
                    });
                },
                postQuestion: function (question) { // h
                    var questionObject = {
                        id: "",
                        questionType: question.questionType,
                        questionText: question.questionText,
                        questionChoices: question.questionChoices,
                        referenceCount: question.referenceCount
                    };
                    return postQuestion(questionObject);
                },
                dereferenceQuestions: function (questionsIds) {
                    service.updateQuestions(questionsIds).then(function () {
                        for (var i = 0, len = questionsIds.length; i < len; i++) {
                            var currentIndex = questionsArray.findIndex(function (question) {
                                return question.id == questionsIds[i];
                            });
                            questionsArray[currentIndex].referenceCount--;
                            updateQuestion(questionsArray[currentIndex]);
                        }
                    });
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
