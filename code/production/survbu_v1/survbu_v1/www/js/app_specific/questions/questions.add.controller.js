/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt($state.params.parentSectionId),
            parentSurvey: surveysSrvc.getSurveyAt($state.params.parentSurveyId),
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
            removeChoice: function (removeChoice) {
                vm.question.questionChoices.splice(vm.question.questionChoices.indexOf(removeChoice), 1);
            },
            createQuestion: function () {
                var questionObject = {
                    questionType: vm.question.questionType,
                    questionText: vm.question.questionText,
                    questionChoices: vm.question.questionChoices,
                    referenceCount: ((!vm.parentSection || vm.parentSection === 0) ? 0 : 1) // Set referenceCount to 0 if there is no parentSection, i.e from global list
                };
                questionsSrvc.isWaiting(true);
                sectionsSrvc.isWaiting(true);
                
                questionsSrvc.postQuestion(questionObject).then(function (response) {
                    var newQuestionID = response.id;
                    
                    $ionicHistory.goBack();

                    if (!vm.parentSection || vm.parentSection === 0) { // stop list from showing updating if no parent section, i.e global list
                        questionsSrvc.isWaiting(false);
                    } else if (vm.parentSection !== 0) {
                        vm.parentSection.questionIds.push(newQuestionID);
                        questionsSrvc.isWaiting(false); // once new questionID added to array, allow user to view

                        // PUTs the new parentSection to API
                        sectionsSrvc.updateSection(vm.parentSection).then(function () {
                            // Given an array of sectionIds, updates the section array with the retrieves section objects.
                            sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                sectionsSrvc.isWaiting(false);
                            });
                        });
                    }
                });
            }
        });
    }
}());
