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
        var params = $stateParams,
            vm = angular.extend(this, {
                question: {
                    questionText: "no text",
                    questionType: "no type"
                }
            });

        vm.done = function () {
            $state.go('questions_list');
        };

        vm.question = questionsSrvc.getQuestionAt(params.selected);

    }
}());
