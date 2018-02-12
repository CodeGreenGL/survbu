/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        surveysSrvc
    ) {
        angular.extend(this, {
            survey: surveysSrvc.getSurveyAt($stateParams.selected),
            submitButton: function () {
                $state.go('surveys_list');
            }
        });
    }
}());
