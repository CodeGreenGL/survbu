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
        var surveyId = $stateParams.surveyId,
            vm = angular.extend(this, {
            survey: surveysSrvc.getSurveyAt(surveyId),
            submitButton: function () {
                $state.go('surveys_list');
            }
        });
    }
}());
