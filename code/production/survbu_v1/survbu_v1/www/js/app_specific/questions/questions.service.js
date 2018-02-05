(function () {
    'use strict';

    angular
        .module('questionsjs')
        .factory('questionsSrvc', questionsSrvc);

    questionsSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function questionsSrvc(
        $q,
        $http
    ) {

        var questionsArray = [];
        var waitingState = true;

        var service = { };
       
        //get all surveys from codegreen restlet; returns deferred promise
        var getAllQuestions = function(){
            var deferred = $q.defer();

            $http({
                url: 'https://codegreen.restlet.net/v1/questions/',
                headers : {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                    "content-type": "application/json",
                    "accept": "application/json",
                }
            }).then(function successCallback(response) {
                questionsArray = response.data;
                deferred.resolve(questionsArray);
            }, function errorCallback(response) {
                console.error('Error while fetching notes');
                console.error(response);
            });
            
            return deferred.promise;
        }

        var promiseToUpdateQuestions = function(){
            // returns a promise
            return getAllQuestions();
        }

        service.updateQuestions = function(){
            questionsArray = [];
            return promiseToUpdateQuestions();   
        } 

        service.getQuestions = function(){
            return angular.copy(questionsArray);
        }

        service.getNumQuestions = function(){
            return questionsArray.length;
        }

        service.getQuestionAt = function(index){
            return angular.copy(questionsArray[index]);
        }

        service.isWaiting = function(iWait){
            waitingState = iWait;
        }

        service.isItWaiting = function(){
            return waitingState;
        }

        return service;
    }
})();
