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
        var questionsArray = [],
            allQuestionsArray = [],
            remainingQuestionsArray = [],
            waitingState = false,
            getSectionQuestions = function (sectionQuestions) {
                var deferred = $q.defer(),
                    i = 0,
                    len;
                if (sectionQuestions.length > 0) {
                    for (len = sectionQuestions.length; i < len; i = i + 1) {
                        $http({
                            url: 'https://codegreen.restlet.net/v1/questions/' + sectionQuestions[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
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
            promiseToUpdateQuestions = function (sectionQuestions) {
                // returns a promise
                return getSectionQuestions(sectionQuestions);
            },
            promiseToUpdateAllQuestions = function () {
                return getAllQuestions();
            },
            removeAlreadyAdded = function () {
                var deferred = $q.defer();
                service.updateAllQuestions().then(function() {
                    remainingQuestionsArray = angular.copy(allQuestionsArray);
                    if (questionsArray.length > 0) {
                        for (var i = 0; i < questionsArray.length; i++) {
                            var removeIndex = remainingQuestionsArray.map(function(question) { return question.id; }).indexOf(questionsArray[i].id);
                            remainingQuestionsArray.splice(removeIndex, 1);
                        };
                    };
                    for (var i = 0; i < remainingQuestionsArray.length; i++) {
                        remainingQuestionsArray[i].adding = false;
                    };
                    deferred.resolve(remainingQuestionsArray);
                });
                return deferred.promise;
            },
            service = {
                updateQuestions: function (sectionQuestions) {
                    questionsArray = [];
                    return promiseToUpdateQuestions(sectionQuestions);
                },
                updateAllQuestions: function () {
                    allQuestionsArray = [];
                    return promiseToUpdateAllQuestions();
                },
                getQuestions: function () {
                    return angular.copy(questionsArray);
                },
                getAllQuestions: function () {
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
                isWaiting: function (iWait) {
                    waitingState = iWait;
                },
                isItWaiting: function () {
                    return waitingState;
                },
                updateRemainingQuestions: function () {
                    return removeAlreadyAdded ();
                },
                getRemainingQuestions: function () {
                    return angular.copy(remainingQuestionsArray);
                }
            };
        return service;
    }
}());
