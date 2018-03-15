/*global angular*/
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        '$ionicPopup',
        'sectionsSrvc',
        'questionsSrvc',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicPopup,
        sectionsSrvc,
        questionsSrvc,
        surveysSrvc

    ) {
        var isGlobal = $state.params.sectionId === 0;

        if (isGlobal) { // Update questions if global list, i.e no parent section id
            questionsSrvc.isWaiting(true);
            questionsSrvc.getAllQuestions().then(function (responseQuestions) {
                vm.questions = responseQuestions;
                questionsSrvc.isWaiting(false);
            });
        } else {
            questionsSrvc.isWaiting(true);
            questionsSrvc.updateQuestions(sectionsSrvc.getSectionAt($state.params.sectionId).questionIds).then(function () {
                vm.questions = questionsSrvc.getQuestions();
                questionsSrvc.isWaiting(false);
            });
        }

        var vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt($stateParams.sectionId),
            parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
            questions: questionsSrvc.getQuestions(),
            allQuestions: questionsSrvc.returnAllQuestions(),
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
            noContentAll: function () {
                return vm.allQuestions.length === 0;
            },
            hideListAll: function () {
                return (vm.stillWaiting() || vm.noContentAll());
            },
            hideNoItemsAll: function () {
                return (vm.stillWaiting() || !vm.noContentAll());
            },
            addFromExisting: function () {
                questionsSrvc.isWaiting(true);
                $state.go('questions_addfe', {
                    sectionId: vm.parentSection.id,
                    surveyId: vm.parentSurvey.id
                });
                questionsSrvc.updateRemainingQuestions().then(function () {
                    $state.reload();
                    questionsSrvc.isWaiting(false);
                });
            },
            showDeleteAlert: function ($event, questionId) {
                $event.stopPropagation();

                var selectedQuestion = (isGlobal) ? questionsSrvc.getQuestionAtGlobal(questionId) : questionsSrvc.getQuestionAt(questionId),
                    referenceCount = selectedQuestion.referenceCount;

                if ((isGlobal) && referenceCount > 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                        template: 'Questions from the global list can only be deleted if referenceCount is 0.'
                    });
                } else if (referenceCount > 1) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                        template: 'This question is used in ' + referenceCount + ' sections, and cannot be deleted.'
                    });
                } else if (referenceCount === 0 || referenceCount === 1 || referenceCount === null) {
                    $ionicPopup.confirm({
                        title: 'Delete Question',
                        template: 'Are you sure you want to delete \'' + selectedQuestion.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {
                            var removeIndex = vm.questions.findIndex(function (quest) {
                                return quest.id === questionId;
                            });
                            vm.questions.splice(removeIndex, 1);
                            questionsSrvc.deleteQuestion(selectedQuestion.id);

                            if (!isGlobal) {
                                vm.parentSection.questionIds.splice(removeIndex, 1);
                                sectionsSrvc.updateSectionsFromQuestionID(selectedQuestion.id, vm.parentSection.id).then(function () {
                                    sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                        questionsSrvc.updateQuestions(vm.parentSection.questionIds);
                                    });
                                });
                            } // if not in the global list, update the sections list
                        }
                    });
                }
            }
        });
    }
}());
