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
            deleteSectionID = function (sectionID) {
                var deferred = $q.defer();
                $http({
                    method: 'DELETE',
                    url: 'https://codegreen.restlet.net/v1/surveySections/' + sectionID,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                }).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSection = function (localSection) {
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
            createSection = function (sectionObject) {
                var addedSections,
                    deferred = $q.defer();

                $http({
                    method: "POST",
                    url: 'https://codegreen.restlet.net:443/v1/surveySections/',
                    data: sectionObject,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
                    addedSections = response.data;    
                    //Add sections to our sectionArray
                    sectionsArray.push(addedSections);
                    deferred.resolve(addedSections);
                    
                }, function errorCallback(response) {
                    console.error('Error while fetching notes');
                    console.error(response);
                });
                return deferred.promise;
            },
            promiseToGetSurveySections = function (surveySections) {
                // returns a promise
                return getSurveySections(surveySections);
            },
            promiseToGetAllSections = function () {
                // returns a promise
                return getAllSections();
            },
            promiseToDeleteSectionID = function (sectionID) {
                // returns a promise
                return deleteSectionID(sectionID);
            },
            promiseToUpdateSection = function (localSection) {
                // returns a promise
                return updateSection(localSection);
            },
            promiseToCreateSection = function (sectionObject) {
                // returns a promise
                return createSection(sectionObject);
            },
            service = {
                updateSections: function (surveySections) {
                    sectionsArray = [];
                    return promiseToGetSurveySections(surveySections);
                },
                getAllSections: function () {
                    sectionsArray = [];
                    return promiseToGetAllSections();
                },
                deleteSection: function (sectionID) {
                    return promiseToDeleteSectionID(sectionID);
                },
                updateSection: function (questionID) {
                    var localSection = sectionsArray[currentSection];
                    localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                    sectionsArray[currentSection] = localSection;
                    
                    return promiseToUpdateSection(localSection);
                },
                updateCreateSection: function (localSection) {
                    return promiseToUpdateSection(localSection);
                },
                addQuestionsToSection: function (questionsArray) {
                    var localSection = sectionsArray[currentSection];

                    for (var i = 0; i < questionsArray.length; i++) {
                        localSection.questionIds.push(questionsArray[i]);
                    }
                    
                    sectionsArray[currentSection] = localSection;
                    
                    return promiseToUpdateSection(localSection);
                },
                setCurrentSection: function (index) {
                    currentSection = parseInt(index, 10);
                },
                returnSections: function () {
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
                createSectionService: function(sectionHeading, sectionIntroductionMessage) {
                    var sectionObject = {
                        id: "",
                        introductionMessage: sectionIntroductionMessage,
                        questionIds: [],
                        heading: sectionHeading
                    }
                    return promiseToCreateSection(sectionObject);
                },
                isWaiting: function (iWait) {
                    waitingState = iWait;
                },
                isItWaiting: function () {
                    return waitingState;
                },
                getCurrentSection: function () {
                    return currentSection;
                }
            };
        return service;
    }
}());
