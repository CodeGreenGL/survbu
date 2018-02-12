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
        var params = $stateParams,
            vm = angular.extend(this, {
                survey: {
                    introductionMessage: "no text",
                    completionMessage: "no type"
                }
            });

        vm.done = function () {
            $state.go('surveys_list');
        };

        vm.survey = surveysSrvc.getSectionAt(params.selected);

    }
}());
