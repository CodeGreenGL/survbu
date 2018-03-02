/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc
    ) {
        var sectionId = $stateParams.sectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
            section: sectionsSrvc.getSectionAt(sectionId),
            parentSurvey: surveysSrvc.getSurveyAt(surveyId),
            submitButton: function () {
                $state.go('sections_list', {
                    parentSurveyId: parentSurvey.id
                });
            }
        });
    }
}());
