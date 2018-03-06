/*global angular */
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
        //token for v1 = Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOmIzYWU4MTZiLTk1ZTUtNGMyNy1iM2ZjLWRkY2ZmNjZhYjI2Nw==
        //token for v2 = Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==
        var sectionsArray = [],
		    allSectionsArray = [],
		    remainingSectionsArray = [],
            waitingState = false,
            getSurveySections = function (surveySections) {
                var deferred = $q.defer();
                if (surveySections.length > 0) {
                    for (var i = 0; i < surveySections.length; i++) {
                        $http({
                            url: 'https://codegreen.restlet.net/v2/surveySections/' + surveySections[i],
                            headers: {
                                "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
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
                    url: 'https://codegreen.restlet.net/v2/surveySections/',
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    }
                }).then(function successCallback(response) {
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
                $http({
                    method: 'DELETE',
                    url: 'https://codegreen.restlet.net/v2/surveySections/' + sectionID,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                }).then(function successCallback(response) {
                    deferred.resolve();
                }, function errorCallback(response) {
                    console.error('Error while deleting section');
                    console.error(response);
                });
                return deferred.promise;
            },
            updateSection = function (section) {
                var deferred = $q.defer();
                $http({
                    method: 'PUT',
                    url: 'https://codegreen.restlet.net/v2/surveySections/' + section.id,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                        "content-type": "application/json",
                        "accept": "application/json"
                    },
                    data: section
                }).then(function successCallback(response) {
                    deferred.resolve();
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
                    url: 'https://codegreen.restlet.net:443/v2/surveySections/',
                    data: sectionObject,
                    headers: {
                        "authorization": "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
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
            promiseToUpdateSection = function (Section) {
                // returns a promise
                return updateSection(Section);
            },
            promiseToCreateSection = function (sectionObject) {
                // returns a promise
                return createSection(sectionObject);
            },
		    removeAlreadyAdded = function () {
			    var deferred = $q.defer();
			    service.getAllSections().then(function () {
				    remainingSectionsArray = angular.copy(allSectionsArray);
				    if (sectionsArray.length > 0) {
					    for (var i = 0; i < sectionsArray.length; i++) {
						    var removeIndex = remainingSectionsArray.map(function (section) { return section.id; }).indexOf(sectionsArray[i].id);
					    remainingSectionsArray.splice(removeIndex, 1);
					    }
				    }
				    for (var i = 0; i < remainingSectionsArray.length; i++) {
					    remainingSectionsArray[i].adding = false;
				    }
				    deferred.resolve(remainingSectionsArray);
			    });
			    return deferred.promise;
		    },
            service = {
                updateSections: function (surveySections) {
                    sectionsArray = [];
                    return promiseToGetSurveySections(surveySections);
                },
                getAllSections: function () {
                    allSectionsArray = [];
                    return promiseToGetAllSections();
                },
                deleteSection: function (sectionID) {
                    return promiseToDeleteSectionID(sectionID);
                },
                updateSection: function (section) {
                    var section = {
                        id: section.id,
                        introductionMessage: section.introductionMessage,
                        questionIds: section.questionIds,
                        heading: section.heading,
                        referenceCount: section.referenceCount
                    }
                    return promiseToUpdateSection(section);
                },
                returnSections: function () {
                    return angular.copy(sectionsArray);
                },
                getNumSections: function () {
                    return sectionsArray.length;
                },
		        getNumAllSections: function () {
			        return allSectionsArray.length;
		        },
                getSectionAt: function (id) {
                    return angular.copy($filter('filter')(sectionsArray, {id: id}, true)[0]);
                },
                createSection: function(section) {
                    var section = {
                        id: "",
                        introductionMessage: section.introductionMessage,
                        questionIds: [],
                        heading: section.heading,
                        referenceCount: section.referenceCount
                    }
                    return promiseToCreateSection(section);
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
