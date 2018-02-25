/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        sectionsSrvc,
        questionsSrvc
    ) {
        var parentSectionId = $stateParams.parentSectionId,
            vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt(parentSectionId),
                parentSurvey: $stateParams.parentSurvey,
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
                    for (var i = 0; i < vm.questions.length; i++) {
                        if (vm.questions[i].adding === true) {
                            vm.parentSection.questionIds.push(vm.questions[i].id);
                        }
                    };
                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) {
                        var parentSurveySections = vm.parentSurvey.sectionIds;
                        sectionsSrvc.updateSections(parentSurveySections).then(function () {
                            var sectionQuestions = vm.parentSection.questionIds;
                            questionsSrvc.updateQuestions(sectionQuestions).then(function (response) {
                                $state.go('questions_list', {
                                    parentSection: vm.parentSection
                                });
                            });
                        });
                    });
                }
        });
    }
}());
