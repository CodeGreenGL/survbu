/*global angular*/
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddfeCtrl', control);

    control.$inject = [
        '$ionicHistory',
        '$stateParams',
        '$q',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $ionicHistory,
        $stateParams,
        $q,
        surveysSrvc,
        sectionsSrvc
    ) {
        sectionsSrvc.isWaiting(true);
        sectionsSrvc.updateRemainingSections().then(function (response) {
            vm.sections = response;
            sectionsSrvc.isWaiting(false);
        });
        var vm = angular.extend(this, {
            parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
            sections: sectionsSrvc.getRemainingSections(),
            stillWaiting: function () {
                return sectionsSrvc.isItWaiting();
            },
            noContent: function () {
                return vm.sections.length === 0;
            },
            hideList: function () {
                return (vm.stillWaiting() || vm.noContent());
            },
            hideNoItems: function () {
                return (vm.stillWaiting() || !vm.noContent());
            },
            addSections: function () {
                for (var i = 0, len = vm.sections.length; i < len; i = i + 1) { // For each section
                    if (vm.sections[i].adding === true) {
                        vm.parentSurvey.sectionIds.push(vm.sections[i].id); // Add chosen sections to parent survey
                        vm.sections[i].referenceCount = vm.sections[i].referenceCount + 1; // Increment referencecount for the section
                        delete vm.sections[i].adding;
                        sectionsSrvc.updateSection(vm.sections[i]);
                    }
                }

                sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function () {
                        surveysSrvc.updateAllSurveys().then(function () {
                            $ionicHistory.goBack();
                        });
                    });
                });
            } // end addSections
        });
    }
}());
