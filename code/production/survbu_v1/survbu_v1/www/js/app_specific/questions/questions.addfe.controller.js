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
        '$q',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        $q,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var parentSectionId = $stateParams.parentSectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt(parentSectionId),
                parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
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
                    var promisesQ = [];
                    for (var i = 0; i < vm.questions.length; i++) {
                        if (vm.questions[i].adding === true) {                         
                            vm.parentSection.questionIds.push(vm.questions[i].id);
                            vm.questions[i].referenceCount = vm.questions[i].referenceCount + 1;
                            promisesQ.push(questionsSrvc.updateQuestion(vm.questions[i]));
                        }
                    };
                    $q.all(promisesQ).then(function () {
                        sectionsSrvc.updateSection(vm.parentSection).then(function (response) {
                            var parentSurveySections = vm.parentSurvey.sectionIds;
                            sectionsSrvc.updateSections(parentSurveySections).then(function () {
                                var sectionQuestions = vm.parentSection.questionIds;
                                questionsSrvc.updateQuestions(sectionQuestions).then(function (response) {
                                    $state.go('questions_list', {
                                        parentSectionId: vm.parentSection.id,
                                        parentSurveyId: vm.parentSurvey.id			
                                    });
                                });
                            });
                        });
                    });
                }
        });
    }
}());
