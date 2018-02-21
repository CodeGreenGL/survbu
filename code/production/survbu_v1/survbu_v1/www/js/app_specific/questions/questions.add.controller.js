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
            parentSection: $stateParams.parentSection,
            parentSectionSurvey: $stateParams.parentSectionSurvey,
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

                    var newQuestionID = response.id;
                    vm.parentSection.questionIds.push(newQuestionID);

                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) {
                        var parentSectionSurveySections = vm.parentSectionSurvey['sectionIds'];
                        sectionsSrvc.updateSections(parentSectionSurveySections).then(function () {
                            //surveysSrvc.isWaiting(false);
                            //$state.reload();
                       });
                    });
                });
            }
        });
    }
}());
