/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            questions: questionsSrvc.getRemainingQuestions(),

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
            addQuestions: function () {
                var questionsToAdd = [];
                for (var i = 0; i < vm.questions.length; i++) {
                    if (vm.questions[i].adding === true) {
                        questionsToAdd.push(vm.questions[i].id);
                    }
                }
                    console.log("to add: " + questionsToAdd);
                // HERE we need questionsSrvc that adds the above array (questionsToAdd) to an array of questions of current Section and then updates that Section's questionsIds (PUT)
            }
        });
    }
}());
