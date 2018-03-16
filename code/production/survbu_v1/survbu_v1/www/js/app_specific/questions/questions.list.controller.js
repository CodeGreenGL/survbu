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
        var isGlobal = $state.params.sectionId === 0,
            isSectionsGlobal = $state.params.surveyId === 0;
        
        questionsSrvc.isWaiting(true);
        if (isGlobal) { // Update questions if global list, i.e no parent section id
            questionsSrvc.getAllQuestions().then(function (responseQuestions) {
                vm.questions = responseQuestions;
                questionsSrvc.isWaiting(false);
            });
        } else if (isSectionsGlobal) { // Update if user came from global sections list then clicked a question
            questionsSrvc.updateQuestions(sectionsSrvc.getSectionAtGlobal($state.params.sectionId).questionIds).then(function () {
                vm.questions = questionsSrvc.getQuestions();
                vm.parentSection = sectionsSrvc.getSectionAtGlobal($state.params.sectionId);
                questionsSrvc.isWaiting(false);
            });
        } else { // Update through normal navigation of app
            questionsSrvc.updateQuestions(sectionsSrvc.getSectionAt($state.params.sectionId).questionIds).then(function () {
                vm.questions = questionsSrvc.getQuestions();
                questionsSrvc.isWaiting(false);
            });
        }

        var vm = angular.extend(this, {
            isGlobal: isGlobal,
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
            showDeleteAlert: function ($event, questionId) {
                $event.stopPropagation();

                var selectedQuestion = (isGlobal) ? questionsSrvc.getQuestionAtGlobal(questionId) : questionsSrvc.getQuestionAt(questionId),
                    referenceCount = selectedQuestion.referenceCount;

                if (!isGlobal) {
                    $ionicPopup.confirm({
                        title: 'Remove Question',
                        template: 'Are you sure you want to remove \'' + selectedQuestion.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {
                            var removeIndex = vm.questions.findIndex(function (quest) {
                                return quest.id === questionId;
                            });
                            vm.questions.splice(removeIndex, 1);
                            vm.parentSection.questionIds.splice(removeIndex, 1);
                            questionsSrvc.dereferenceQuestions([selectedQuestion.id]);

                            sectionsSrvc.updateSectionsFromQuestionID(selectedQuestion.id, vm.parentSection.id).then(function () {
                                sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                    questionsSrvc.updateQuestions(vm.parentSection.questionIds);
                                });
                            });
                        }
                    });
                } else if ((isGlobal) && (referenceCount > 0)) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                        template: 'Questions from the global list can only be deleted if referenceCount is 0.'
                    });
                } else if ((isGlobal) && (referenceCount === 0 || referenceCount === null)) {
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
                        }
                    });
                }
            }
        });
    }
}());
