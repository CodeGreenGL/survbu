/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .factory('sectionsSrvc', sectionsSrvc);

    sectionsSrvc.$inject = [
        '$q', // promises service
        '$http', // HTTP service
        '$filter'
    ];

    function sectionsSrvc(
        $q,
        $http,
        $filter
    ) {
        //get all sections from codegreen restlet; returns deferred promise
        var sectionsUrl = "https://codegreen.restlet.net/v2/surveySections/",
            sectionsArray = [],
            waitingState = false,
            getSurveySections = function (surveySections) {
                var deferred = $q.defer(),
                    httpPromises = [];
                if (surveySections.length > 0) {
                    for (var i = 0, len = surveySections.length; i < len; i = i + 1) {
                        httpPromises[i] = $http.get(sectionsUrl + surveySections[i]).then(function successCallback(response) {
                            sectionsArray.splice(surveySections.indexOf(response.data.id), 0, response.data);
                        }, function errorCallback(response) {
                            console.error('Error ' + response.status + ' while fetching sections');
                            console.error(response);
                        });
                    }
                    $q.all(httpPromises).then(function () { // Create a promise that completes when all httpPromises have resolved, thereby not blocking the function
                        deferred.resolve(sectionsArray); // resolve the promise 'deferred', to stop "Updating" from being shown on questions list
                    });
                } else { // If no requests have to be performed (empty surveySections), then resolve the empty array that was set from the parent's parent's function
                    deferred.resolve(sectionsArray);
                }
                return deferred.promise;
            },
            getAllSections = function () {
                var deferred = $q.defer();
                $http.get(sectionsUrl).then(function successCallback(response) {
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
                $http.delete(sectionsUrl + sectionID).then(function successCallback(response) {
                    sectionsArray.splice(sectionsArray.findIndex(section => section.id == sectionID), 1); // Remove the section at the index found
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSection = function (localSection) {
                var deferred = $q.defer();
                $http.put(sectionsUrl + localSection.id, localSection).then(function successCallback(response) {
                    deferred.resolve(sectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            createSection = function (sectionObject) {
                var addedSections,
                    deferred = $q.defer();
                $http.post(sectionsUrl, sectionObject).then(function successCallback(response) {
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
                    return getSurveySections(surveySections);
                },
                updateSectionsFromQuestionID: function (questionID, sectionID) {
                    var arrayIndex = sectionsArray.findIndex(section => section.id == sectionID),
                        localSection = sectionsArray[arrayIndex];
                    
                    localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                    sectionsArray[arrayIndex] = localSection;
                    
                    return updateSection(localSection);
                },
                getAllSections: function () {
                    sectionsArray = [];
                    return getAllSections();
                },
                deleteSection: function (sectionID) {
                    return deleteSectionID(sectionID);
                },
                updateSection: function (localSection) {
                    return updateSection(localSection);
                },
                returnSections: function () {
                    return angular.copy(sectionsArray);
                },
                getNumSections: function () {
                    return sectionsArray.length;
                },
                getSectionAt: function (sectionID) {
                    //_.find(sectionsArray, ['id', sectionID])); Lodash equivalent
                    return sectionsArray.find(section => section.id == sectionID);
                },
                createSection: function(sectionObject) {
                    return createSection(sectionObject);
                },
                dereferenceSections: function (sectionIds) {
                    service.updateSections(sectionIds).then(function () {
                        for (var i = 0, len = sectionIds.length; i < len; i++) {
                            var currentIndex = sectionsArray.findIndex(section => section.id == sectionIds[i]);
                            sectionsArray[currentIndex].referenceCount--;
                            updateSection(sectionsArray[currentIndex]);
                        }
                    });
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
