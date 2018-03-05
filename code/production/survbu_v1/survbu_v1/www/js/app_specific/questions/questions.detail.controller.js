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
        var vm = angular.extend(this, {
                 question: questionsSrvc.getQuestionAt($stateParams.questionId),
                 submitButton: function () {
                    $state.go('questions_list');
                 },
                 containsChoices: function() {
                    if(vm.question.questionType === "MULTIPLE_SELECT" || vm.question.questionType === "SINGLE_SELECT"){
                       return true; 
                    }
                return false;
                }
            });
    }
}());
