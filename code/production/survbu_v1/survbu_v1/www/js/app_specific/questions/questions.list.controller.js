/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicPopup,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {

        if ($state.params.parentSectionId === 0) { // Update questions if global list, i.e no parent section id
            questionsSrvc.isWaiting(true);
            questionsSrvc.getAllQuestions().then(responseQuestions => {
                vm.questions = responseQuestions;
                questionsSrvc.isWaiting(false);
            });
        } else if ($state.params.parentSectionId !== 0) {
            questionsSrvc.isWaiting(true);
            questionsSrvc.updateQuestions(sectionsSrvc.getSectionAt($state.params.parentSectionId).questionIds).then(function () {
                vm.questions = questionsSrvc.getQuestions();
                questionsSrvc.isWaiting(false);
            });
        }
        var stateParams = $state.params,
            vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt(stateParams.parentSectionId),
                parentSurvey: surveysSrvc.getSurveyAt(stateParams.parentSurveyId),
                questions: questionsSrvc.getQuestions(),
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
                selectDetail: function selectDetail(questionId) {
                    $state.go('questions_detail', {
                        questionId: questionId
                    });
                },
                addQuestion: function () {
                    $state.go('questions_add', {
                        parentSectionId: vm.parentSection.id,
                        parentSurveyId: vm.parentSurvey.id
                    });
                },
                addFromExisting: function () {
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_addfe', {
                        parentSectionId: vm.parentSection.id,
                        parentSurveyId: vm.parentSurvey.id
                    });
                    questionsSrvc.updateRemainingQuestions().then(function () {
                        $state.reload();
                        questionsSrvc.isWaiting(false);
                    });
                },
                showDeleteAlert: function ($event, questionId) {
                    $event.stopPropagation();

                    var selectedQuestion = questionsSrvc.getQuestionAt(questionId),
                        referenceCount = selectedQuestion.referenceCount;

                    if ((!vm.parentSection || vm.parentSection === 0) && referenceCount > 0) {
                        $ionicPopup.alert({
                            title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                            template: 'Questions from the global list can only be deleted if referenceCount is 0.'
                        });
                    } else if (referenceCount > 1) {
                        $ionicPopup.alert({
                            title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                            template: 'This question is used in ' + referenceCount + ' sections, and cannot be deleted.'
                        });
                    } else if (referenceCount === 0 || referenceCount === 1 || referenceCount === null) { // null and 0 part can be removed when questions are cleaned
                        // referenceCount should only have values of 1 or above in cleaned questions (i.e ref 1 for only being in that section, any more for being used in multiple)
                        $ionicPopup.confirm({
                            title: 'Delete Question',
                            template: 'Are you sure you want to delete \'' + selectedQuestion.questionText + '\'?'
                        }).then(function (response) {
                            if (response) {
                                vm.questions.splice(vm.questions.findIndex(question => question.id == selectedQuestion.id), 1); // Remove the question at the index of the questions list
                                questionsSrvc.deleteQuestion(selectedQuestion.id); // can put a .then here for error checking the delete response from promise
                                if (vm.parentSection !== 0 && vm.parentSection) {
                                    sectionsSrvc.updateSectionsFromQuestionID(selectedQuestion.id, vm.parentSection.id);
                                } // if not in the global list, update the sections list
                            } else {
                                console.log('User pressed cancel');
                            }
                        });
                    }

                }

            });
    }
}());
