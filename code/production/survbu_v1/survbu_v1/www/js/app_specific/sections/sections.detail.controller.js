/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc,
        surveysSrvc
    ) {
        var isGlobal = $stateParams.surveyId === 0,
            vm = angular.extend(this, {
                section: (isGlobal) ? sectionsSrvc.getSectionAtGlobal($stateParams.sectionId) : sectionsSrvc.getSectionAt($stateParams.sectionId),
                parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
                referenceCount: function () {
                    if (vm.section.referenceCount > 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                updateSection: function () {
                    sectionsSrvc.updateSection(vm.section).then(function () {
                        return vm.listSections();
                    });
                },
                listSections: function () {
                    sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                        $state.go('sections_list', {
                            surveyId: vm.parentSurvey.id //response may be renamed to survey and response.id => survey.id
                        });
                    });
                }
            });
    }
}());
