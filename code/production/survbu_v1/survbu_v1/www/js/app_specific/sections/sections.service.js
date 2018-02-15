/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('sectionsSrvc', sectionsSrvc);

    sectionsSrvc.$inject = [
        '$q', // promises service
        '$http' // HTTP service
    ];

    function sectionsSrvc(
        $q,
        $http
    ) {
        //get all sections from codegreen restlet; returns deferred promise
        var sectionsArray = [],
            currentSection,
            waitingState = false, // Set waitingstate to false so surveys load
            getSurveySections = function (surveySections) {
                var deferred = $q.defer();
                if (surveySections.length > 0) {
                    for (var i = 0, len = surveySections.length; i < len; i++) {
                        $http({
                            url: 'https://codegreen.restlet.net/v1/surveySections/' + surveySections[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                                "content-type": "application/json",
                                "accept": "application/json"
                            }
                        }).then(function successCallback(response) {
                            sectionsArray.splice(surveySections.indexOf(response.data.id), 0, response.data);
                            if (sectionsArray.length === surveySections.length) {
                                deferred.resolve(sectionsArray);
                            }
                        }, function errorCallback(response) {
                            console.error('Error while fetching sections');
                            console.error(response);
                        });
                    }
                } else {
                    deferred.resolve(sectionsArray);
                }
                return deferred.promise;
            },
            getAllSections = function () {
                var deferred = $q.defer();
                $http({
                    url: 'https://codegreen.restlet.net/v1/surveySections/',
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    sectionsArray = response.data;
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteQuestionFromSection = function (localSection) {
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: 'https://codegreen.restlet.net/v1/surveySections/' + localSection.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    data: localSection
                }).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            promiseToUpdateSections = function (surveySections) {
                // returns a promise
                return getSurveySections(surveySections);
            },
            promiseToUpdateAllSections = function () {
                // returns a promise
                return getAllSections();
            },
            promiseToDeleteQuestionFromSection = function (localSection) {
                // returns a promise
                return deleteQuestionFromSection(localSection);
            },
            service = {
                updateSections: function (surveySections) {
                    sectionsArray = [];
                    return promiseToUpdateSections(surveySections);
                },
                updateAllSections: function () {
                    sectionsArray = [];
                    return promiseToUpdateAllSections();
                },
                deleteQuestionFromSection: function (questionID) {
                    var localSection = sectionsArray[currentSection];
                    localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                    sectionsArray[currentSection] = localSection;
                    
                    return promiseToDeleteQuestionFromSection(localSection);
                },
                setCurrentSection: function (index) {
                    currentSection = parseInt(index, 10);
                },
                getSections: function () {
                    return angular.copy(sectionsArray);
                },
                getNumSections: function () {
                    return sectionsArray.length;
                },
                disposeSections: function () {
                    sectionsArray = [];
                },
                getSectionAt: function (index) {
                    return angular.copy(sectionsArray[index]);
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
