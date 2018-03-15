/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        '$ionicHistory',
        'questionsSrvc',
        'sectionsSrvc',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicHistory,
        questionsSrvc,
        sectionsSrvc,
        surveysSrvc
    ) {
        var isGlobal = $stateParams.sectionId === 0,
            vm = angular.extend(this, {
                parentSection: (isGlobal) ? sectionsSrvc.getSectionAtGlobal($stateParams.sectionId) : sectionsSrvc.getSectionAt($stateParams.sectionId),
                parentSurvey: (isGlobal) ? undefined : surveysSrvc.getSurveyAt($stateParams.surveyId),
                question: (isGlobal) ? questionsSrvc.getQuestionAtGlobal($stateParams.questionId) : questionsSrvc.getQuestionAt($stateParams.questionId),
                cancelEditing: function () {
                    $state.go('questions_list', {
                        sectionId: vm.parentSection.id,
                        surveyId: vm.parentSurvey.id
                    });
                },
                containsChoices: function () {
                    if (vm.question.questionType === "MULTIPLE_SELECT" || vm.question.questionType === "SINGLE_SELECT") {
                        return true;
                    }
                    return false;
                },
                addChoice: function (addChoice) {
                    vm.question.questionChoices.push(addChoice);
                },
                updateQuestion: function () {
                    questionsSrvc.updateQuestion(vm.question).then(function () {
                        $ionicHistory.goBack();
                    });
                },
                referenceCount: function () {
                    if (vm.question.referenceCount > 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            });
    }
}());
