/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc'
    ];

    function control(
        $state,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {
            survey: surveysSrvc.getSurveyAt($state.params.surveyId),
            submitButton: function () {
                $state.go('surveys_list');
            }
        });
    }
}());
