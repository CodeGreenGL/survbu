/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        'questionsSrvc',
        '$stateParams'
    ];

    function control(
        $state,
        questionsSrvc,
        $stateParams
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                parentSection: params.parentSection,
                parentSectionSurvey: params.parentSectionSurvey,
                questions: [],
                stillWaits: questionsSrvc.isItWaiting()
        });

        vm.onItemSelected = function (index) {
            $state.go('questions_detail', {
                selected: index
            });
        };

        vm.update = function () {
            $state.go('questions_update');
        };

        vm.stillWaiting = function () {
            return vm.stillWaits;
        };

        vm.noContent = function () {
            return vm.questions.length === 0;
        };

        vm.hideList = function () {
            return (vm.stillWaiting() || vm.noContent());
        };

        vm.hideNoItems = function () {
            return (vm.stillWaiting() || !vm.noContent());
        };

        vm.addQuestion = function (){
            $state.go('questions_add', {
                parentSection: vm.parentSection,
                parentSectionSurvey: vm.parentSectionSurvey
                });
        };

        vm.questions = questionsSrvc.getQuestions();

    }
}());
