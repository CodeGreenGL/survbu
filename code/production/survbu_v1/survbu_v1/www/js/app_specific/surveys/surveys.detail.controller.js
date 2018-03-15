/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$ionicHistory',
        '$stateParams',
        'surveysSrvc'
    ];

    function control(
        $ionicHistory,
        $stateParams,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {
            survey: surveysSrvc.getSurveyAt($stateParams.surveyId),
            updateSurvey: function () {
                surveysSrvc.updateSurvey(vm.survey).then(function () {
                    $ionicHistory.goBack();
                });
            }
        });
    }
}());
