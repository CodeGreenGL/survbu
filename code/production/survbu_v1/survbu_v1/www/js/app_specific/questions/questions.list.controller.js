/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
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
            questions: questionsSrvc.getQuestions(),
            stillWaits: questionsSrvc.isItWaiting(),
            stillWaiting: function () {
                return vm.stillWaits;
            },
            noContent: function () {
                return vm.questions.length === 0;
            },
            hideList: function () {
                return (vm.stillWaiting() || vm.noContent());
            },
            hideNoItems: function () {
                return (vm.stillWaiting() || !vm.noContent());
            },
            selectDetail: function selectDetail(index) {
                $state.go('questions_detail', {
                    selected: index
                });
            }
        });
    }
}());