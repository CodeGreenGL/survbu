/*global angular */
(function () {
    'use strict';

    angular
        .module('surveysjs')
        .controller('surveysUpdateCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc'
    ];

    function control(
        $state,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {

        });

        // TODO: Error Handling
        surveysSrvc.updateSurveys().then(function () {
            $state.go('surveys_list');
        });
    }
}());
