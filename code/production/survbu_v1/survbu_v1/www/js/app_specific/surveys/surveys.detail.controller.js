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
        var vm = angular.extend(this, {
            survey: $stateParams.survey,
            submitButton: function () {
                $state.go('surveys_list');
            }
        });
    }
}());
