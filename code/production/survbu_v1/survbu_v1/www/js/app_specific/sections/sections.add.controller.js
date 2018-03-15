/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc
    ) {
        var isGlobal = $state.params.surveyId === 0,
            vm = angular.extend(this, {
                parentSurvey: surveysSrvc.getSurveyAt($state.params.surveyId),
                section: {
                    heading: "",
                    introductionMessage: ""
                },
                createSection: function () {
                    var sectionObject = {
                        heading: vm.section.heading,
                        introductionMessage: vm.section.introductionMessage,
                        referenceCount: ((isGlobal) ? 0 : 1) // Set referenceCount to 0 if there is no parentSection, i.e from global list
                    };

                    sectionsSrvc.createSection(sectionObject).then(function (response) {
                        var newSection = response;

                        surveysSrvc.updateAllSurveys().then(function () {
                            surveysSrvc.updateAllSurveys().then(function () {
                                $ionicHistory.goBack();
                            });
                        });

                        if (!isGlobal) {
                            vm.parentSurvey.sectionIds.push(newSection.id);

                            surveysSrvc.updateSurvey(vm.parentSurvey).then(function () { // PUTs the new parentSection to API
                                surveysSrvc.updateAllSurveys().then(function () { // Updates the entire surveys list with a fresh GET
                                    surveysSrvc.isWaiting(false);
                                });
                            });
                        }
                    });
                }
            });
    }
}());
