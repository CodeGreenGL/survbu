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
        var sectionsUrl = "https://codegreen.restlet.net/v2/surveySections/",
            configObject = {
                headers: {
                    "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                    "content-type": "application/json",
                    "accept": "application/json"
                }
            },
            sectionsArray = [],
            currentSection,
            waitingState = false, // Set waitingstate to false so surveys load
            getSurveySections = function (surveySections) {
                var deferred = $q.defer();
                if (surveySections.length > 0) {
                    for (var i = 0, len = surveySections.length; i < len; i++) {
                        $http.get(sectionsUrl + surveySections[i], configObject).then(function successCallback(response) {
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
                $http.get(sectionsUrl, configObject).then(function successCallback(response) {
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
                $http.delete(sectionsUrl, configObject).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSections = function (localSection) {
                var deferred = $q.defer();
                $http.put(sectionsUrl + localSection.id, localSection, configObject).then(function successCallback(response) {
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
                console.log(sectionObject);
                $http.post(sectionsUrl, sectionObject, configObject).then(function successCallback(response) {
                    addedSections = response.data;
                    //Add sections to our sectionArray
                    sectionsArray.push(addedSections);
                    deferred.resolve(addedSections);

                }, function errorCallback(response) {
                    console.error('Error while fetching nodes');
                    console.error(response);
                });
                return deferred.promise;
            },
            service = {
                updateSections: function (surveySections) {
                    sectionsArray = [];
                    // returns a promise
                    return getSurveySections(surveySections);
                },
                getAllSections: function () {
                    sectionsArray = [];
                    // returns a promise
                    return getAllSections();
                },
                deleteSection: function (sectionID) {
                    // returns a promise
                    return deleteSectionID(sectionID);
                },
                updateSectionsFromQuestionID: function (questionID) {
                    var localSection = sectionsArray[currentSection];
                    localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                    sectionsArray[currentSection] = localSection;

                    // returns a promise
                    return updateSections(localSection);
                },
                updateCreateSection: function (localSection) {
                    // returns a promise
                    return updateSections(localSection);
                },
                addQuestionsToSection: function (questionsArray) {
                    var localSection = sectionsArray[currentSection];

                    for (var i = 0; i < questionsArray.length; i++) {
                        localSection.questionIds.push(questionsArray[i]);
                    }

                    sectionsArray[currentSection] = localSection;

                    // returns a promise
                    return updateSections(localSection);
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
                createSectionService: function (sectionHeading, sectionIntroductionMessage) {
                    var sectionObject = {
                        introductionMessage: sectionIntroductionMessage,
                        questionIds: [],
                        heading: sectionHeading,
                        referenceCount: 1
                    }
                    // returns a promise
                    return createSection(sectionObject);
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
