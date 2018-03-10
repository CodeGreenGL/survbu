/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var parentSectionId = $stateParams.parentSectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt(parentSectionId),
            parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
            question: {
                questionText: "",
                questionType: "",
                questionChoices: [],
                referenceCount: 1
            },
            displayAddQuestionChoices: function () {
                if (vm.question.questionType === 'MULTIPLE_SELECT' || vm.question.questionType === 'SINGLE_SELECT') {
                    return true;
                }
            },
            addChoice: function (addChoice) {
                vm.question.questionChoices.push(addChoice);
            },
            createQuestion: function () {
                questionsSrvc.createQuestionService(vm.question).then(function (response) {

                    
                    var newQuestionID = response.id;
                    vm.parentSection.questionIds.push(newQuestionID);

                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) { // Should not update the reference count
            
                        sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                            
                            questionsSrvc.updateQuestions(vm.parentSection.questionIds).then(function (response) {
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
