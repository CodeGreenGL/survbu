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
            parentSurvey: $stateParams.parentSurvey,
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
                    console.log("Parent sections in createQuestion" + vm.parentSection);
                    vm.parentSection.questionIds.push(newQuestionID);

                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) {
                        var parentSurveySections = vm.parentSurvey.sectionIds;
                        sectionsSrvc.updateSections(parentSurveySections).then(function () {
                            //surveysSrvc.isWaiting(false);
                            //$state.reload();
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
