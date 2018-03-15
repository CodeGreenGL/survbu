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
                vm.sections.forEach(function (section) { // For each section
                    if (section.adding === true) {
                        vm.parentSurvey.sectionIds.push(section.id); // Add chosen sections to parent survey
                        section.referenceCount = section.referenceCount + 1; // Increment referencecount for the section
                        sectionsSrvc.updateSection(section);
                    }
                });

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
