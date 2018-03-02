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
        var vm = angular.extend(this, {
            parentSectionId: $stateParams.parentSectionId,
            parentSurveyId: $stateParams.parentSurveyId,
            question: {
                questionText: "",
                questionType: "",
                questionChoices: []
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
                questionsSrvc.createQuestionService(vm.question.questionType, vm.question.questionText, vm.question.questionChoices).then(function (response) {

                    var section = sectionsSrvc.getSectionAt(vm.parentSectionId); //Pav obtaining the whole section
                    var newQuestionID = response.id;
                    section.questionIds.push(newQuestionID);

                    sectionsSrvc.updateSection(section).then(function (response) {
                        
                        var survey = surveysSrvc.getSurveyAt(vm.parentSurveyId);
                        sectionsSrvc.updateSections(survey.sectionIds).then(function () {
                            $state.go('questions_list', {
                                parentSectionId: vm.parentSectionId,
                                parentSurveyId: vm.parentSurveyId
                            });
                       });
                    });
                });
            }
        });
    }
}());
