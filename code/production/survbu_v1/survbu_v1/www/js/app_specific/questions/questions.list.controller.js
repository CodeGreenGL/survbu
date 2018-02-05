/*global angular */
(function () {
    'use strict';

    angular
        .module('questionsjs')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        'questionsSrvc'
    ];

    function control(
        $state,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            questions: [],
            stillWaits: questionsSrvc.isItWaiting()
        });

        vm.onItemSelected = function (index) {
            $state.go('questions_detail', {
                selected: index
            });
        };



        //        vm.backToQuestionsButton = function(){
        //            $state.go('sections_update');
        //        };

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

        vm.questions = questionsSrvc.getQuestions();

    }
}());
