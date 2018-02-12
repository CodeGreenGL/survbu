/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        questionsSrvc
    ) {
        angular.extend(this, {
            question: questionsSrvc.getQuestionAt($stateParams.selected),
            submitButton: function () {
                $state.go('questions_list');
            }
        });
    }
}());
