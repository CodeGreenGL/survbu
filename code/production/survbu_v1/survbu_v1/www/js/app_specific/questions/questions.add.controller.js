/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

    control.$inject = [
        '$stateParams',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $stateParams,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var isGlobal = $stateParams.sectionId === 0,
            vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt($stateParams.sectionId),
                parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
                question: {
                    questionText: "",
                    questionType: "",
                    questionChoices: [],
                    referenceCount: (isGlobal) ? 0 : 1 // Set referenceCount to 0 if there is no parentSection, i.e from global list
                },
                displayAddQuestionChoices: function () {
                    if (vm.question.questionType === 'MULTIPLE_SELECT' || vm.question.questionType === 'SINGLE_SELECT') {
                        return true;
                    }
                },
                addChoice: function (addChoice) {
                    vm.question.questionChoices.push(addChoice);
                },
                removeChoice: function (removeChoice) {
                    vm.question.questionChoices.splice(vm.question.questionChoices.indexOf(removeChoice), 1);
                },
                createQuestion: function () {
                    questionsSrvc.postQuestion(vm.question).then(function (response) {
                        var newQuestionID = response.id;

                        questionsSrvc.getAllQuestions().then(function () {
                            questionsSrvc.getAllQuestions().then(function () {
                                $ionicHistory.goBack();
                            });
                        });

                        if (!isGlobal) {
                            sectionsSrvc.isWaiting(true);
                            vm.parentSection.questionIds.push(newQuestionID);
                            
                            // PUTs the new parentSection to API
                            sectionsSrvc.updateSection(vm.parentSection).then(function () {
                                // Given an array of sectionIds, updates the section array with the retrieved section objects.
                                sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                    // Retrieve questions from API
                                    questionsSrvc.updateQuestions(vm.parentSection.questionIds);
                                });
                            });
                        }
                    });
                }
            });
    }
}());
