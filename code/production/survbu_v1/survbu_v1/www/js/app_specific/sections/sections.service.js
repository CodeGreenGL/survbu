/*global angular, Promise */
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
                var deferred = $q.defer(),
                    httpPromises = [],
                    i = 0,
                    len;
                if (surveySections.length > 0) {
                    for (len = surveySections.length; i < len; i = i + 1) {
                        httpPromises[i] = $http.get(sectionsUrl + surveySections[i], configObject).then(function successCallback(response) {
                            sectionsArray.splice(surveySections.indexOf(response.data.id), 0, response.data);
                            Promise.resolve();
                        }, function errorCallback(response) {
                            console.error('Error while fetching sections');
                            console.error(response);
                        });
                    }
                    Promise.all(httpPromises).then(function () { // Create a promise that completes when all httpPromises have resolved, thereby not blocking the function
                        deferred.resolve(sectionsArray); // resolve the promise 'deferred', to stop "Updating" from being shown on questions list
                    });
                } else { // If no requests have to be performed (empty surveySections), then resolve the empty array that was set from the parent's parent's function
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
                $http.delete(sectionsUrl + sectionID, configObject).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            putSection = function (sectionObject) {
                var deferred = $q.defer();
                $http.put(sectionsUrl + sectionObject.id, sectionObject, configObject).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            postSection = function (sectionObject) {
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
                    var sectionObject = sectionsArray[currentSection];
                    sectionObject.questionIds.splice(sectionObject.questionIds.indexOf(questionID), 1);
                    sectionsArray[currentSection] = sectionObject;

                    // returns a promise
                    return putSection(sectionObject);
                },
                putSection: function (sectionObject) {
                    // returns a promise
                    return putSection(sectionObject);
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
                postSection: function (sectionObject) {
                    return postSection(sectionObject);
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
