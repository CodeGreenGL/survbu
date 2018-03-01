/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsDetailCtrl', control);

    control.$inject = [
        '$state',
        'questionsSrvc'
    ];

    function control(
        $state,
        questionsSrvc
    ) {
        angular.extend(this, {
            question: questionsSrvc.getQuestionAt($state.params.questionId),
            submitButton: function () {
                $state.go('questions_list');
            }
        });
    }
}());
