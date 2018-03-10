/*global angular */
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
        var parentSectionId = $stateParams.parentSectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt(parentSectionId),
            parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
            questions: questionsSrvc.getQuestions(),
            allQuestions: questionsSrvc.returnAllQuestions(), 
            stillWaits: questionsSrvc.isItWaiting(),

            stillWaiting: function () {
                return vm.stillWaits;
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
            selectDetail: function selectDetail(questionId) {
                $state.go('questions_detail', {
                    questionId: questionId,
                    parentSectionId: vm.parentSection.id,
                    parentSurveyId: vm.parentSurvey.id
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

                var question = questionsSrvc.getQuestionAt(questionId);
                $ionicPopup.confirm({
                    title: 'Delete Question',
                    template: 'Are you sure you want to delete \'' + question.questionText + '\'?'
                }).then(function (response) {
                    if (response) {
                        var removeIndex = vm.questions.findIndex(quest => quest.id === questionId);
                        vm.questions.splice(removeIndex, 1);
                        vm.parentSection.questionIds.splice(removeIndex, 1);
                        question.referenceCount = question.referenceCount - 1;
                        questionsSrvc.updateQuestion(question).then(function () {
                            sectionsSrvc.updateSection(vm.parentSection).then(function () {
                                sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                    questionsSrvc.updateQuestions(vm.parentSection.questionIds);
                                });
                            });
                        });
                    } else {
                        console.log('User pressed cancel');
                    }
                });
            },
            showDeleteAlertGlobal: function ($event, questionId) {
                $event.stopPropagation();

                var question = questionsSrvc.getQuestionAtGlobal(questionId);
                if (question.referenceCount > 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question from global list!',
                        template: 'Questions can only be deleted via the relevant section.'
                    });
                } else if (question.referenceCount === 0) {
                    $ionicPopup.confirm({
                        title: 'Delete Question',
                        template: 'Are you sure you want to delete \'' + question.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {
                            var removeIndex = vm.questions.findIndex(quest => quest.id === questionId);
                            vm.questions.splice(removeIndex, 1);
                            questionsSrvc.deleteQuestion(question);
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
           
        });
    }
}());
