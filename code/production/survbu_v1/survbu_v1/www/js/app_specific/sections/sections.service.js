/*global angular, console */
/* eslint no-console: 0*/
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

        var sectionsUrl = "https://codegreen.restlet.net/v2/surveySections/",
            sectionsArray = [],
            allSectionsArray = [],
            remainingSectionsArray = [],
            updatedSection,
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
                    allSectionsArray = response.data;
                    deferred.resolve(allSectionsArray);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
                    console.error(response);
                });
                return deferred.promise;
            },
            deleteSectionID = function (sectionID) {
                var deferred = $q.defer();
                $http.delete(sectionsUrl + sectionID).then(function successCallback() {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting sectionID');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSection = function (localSection) {
                var deferred = $q.defer();
                $http.put(sectionsUrl + localSection.id, localSection).then(function successCallback(response) {
                    updatedSection = response.data;
                    deferred.resolve(updatedSection);
                }, function errorCallback(response) {
                    console.error('Error while fetching questions');
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
                    console.error('Error while fetching notes');
                    console.error(response);
                });
                return deferred.promise;
            },
            removeAlreadyAdded = function () {
                var i,
                    deferred = $q.defer();
                service.getAllSections().then(function () {
                    remainingSectionsArray = angular.copy(allSectionsArray);
                    if (sectionsArray.length > 0) {
                        for (i = 0; i < sectionsArray.length; i++) {
                            var removeIndex = remainingSectionsArray.map(function (section) {
                                return section.id;
                            }).indexOf(sectionsArray[i].id);
                            remainingSectionsArray.splice(removeIndex, 1);
                        }
                    }
                    for (i = 0; i < remainingSectionsArray.length; i++) {
                        remainingSectionsArray[i].adding = false;
                    }
                    deferred.resolve(remainingSectionsArray);
                });
                return deferred.promise;
            },
            service = {
                updateSections: function (surveySections) {
                    sectionsArray = [];
                    return getSurveySections(surveySections);
                },
                updateSectionsFromQuestionID: function (questionID, sectionID, global) {
                    var arrayIndex, localSection;
                    if (global == true) {
                        arrayIndex = allSectionsArray.findIndex(function (section) {
                            return section.id == sectionID;
                        });
                        localSection = allSectionsArray[arrayIndex];

                        localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                        allSectionsArray[arrayIndex] = localSection;
                    } else {
                        arrayIndex = sectionsArray.findIndex(function (section) {
                            return section.id == sectionID;
                        });
                        localSection = sectionsArray[arrayIndex];

                        localSection.questionIds.splice(localSection.questionIds.indexOf(questionID), 1);
                        sectionsArray[arrayIndex] = localSection;
                    }

                    return updateSection(localSection);
                },
                getAllSections: function () {
                    allSectionsArray = [];
                    return getAllSections();
                },
                getSectionAt: function (sectionID) {
                    return sectionsArray.find(function (section) {
                        return section.id === sectionID;
                    });
                },
                getSectionAtGlobal: function (sectionID) {
                    return allSectionsArray.find(function (section) {
                        return section.id === sectionID;
                    });
                },
                getNumSections: function () {
                    return sectionsArray.length;
                },
                getNumAllSections: function () {
                    return allSectionsArray.length;
                },
                createSection: function (sectionObject) {
                    return createSection(sectionObject);
                },
                returnSections: function () {
                    return angular.copy(sectionsArray);
                },
                returnAllSections: function () {
                    return angular.copy(allSectionsArray);
                },
                updateSection: function (localSection) {
                    return updateSection(localSection);
                },
                deleteSection: function (sectionID) {
                    return deleteSectionID(sectionID);
                },
                isWaiting: function (iWait) {
                    waitingState = iWait;
                },
                isItWaiting: function () {
                    return waitingState;
                },
                updateRemainingSections: function () {
                    return removeAlreadyAdded();
                },
                getRemainingSections: function () {
                    return angular.copy(remainingSectionsArray);
                }
            };
        return service;
    }
}());
