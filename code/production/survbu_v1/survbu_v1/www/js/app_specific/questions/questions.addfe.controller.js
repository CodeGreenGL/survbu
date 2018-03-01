/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt($state.params.parentSectionId),
                parentSurvey: surveysSrvc.getSurveyAt($state.params.parentSurveyId),
                questions: questionsSrvc.getRemainingQuestions(),

                stillWaiting: function () {
                    return questionsSrvc.isItWaiting();
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
                    }
                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) {
                        sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                            questionsSrvc.updateQuestions(vm.parentSection.questionIds).then(function () {
                                $state.go('questions_list', {
                                    parentSectionId: vm.parentSection.id
                                });
                            });
                        });
                    });
                }
            });
    }
}());
