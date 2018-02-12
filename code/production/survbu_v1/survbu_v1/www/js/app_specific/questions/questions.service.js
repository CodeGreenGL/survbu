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
            waitingState = false,
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

        return service;
    }
}());
