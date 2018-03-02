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
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicPopup,
        sectionsSrvc,
        questionsSrvc

    ) {
        var vm = angular.extend(this, {
            parentSectionId: $stateParams.parentSectionId,
            parentSurveyId: $stateParams.parentSurveyId,
            questions: ($stateParams.parentSectionId) ? questionsSrvc.getQuestions() : questionsSrvc.returnAllQuestions(), //I have changed to parentSectionId , may need to obtain the section and then compare
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
            selectDetail: function selectDetail(questionId) { //index
                $state.go('questions_detail', {
                    questionId: questionId
                });
            },
            addQuestion: function () {
                $state.go('questions_add', {
                    parentSectionId: vm.parentSectionId,
                    parentSurveyId: vm.parentSurveyId
                });
            },
            addFromExisting: function () {
                questionsSrvc.isWaiting(true);
                $state.go('questions_addfe', {
                    parentSection: vm.parentSection,
                    parentSurvey: vm.parentSurvey
                });
                questionsSrvc.updateRemainingQuestions().then(function () {
                    $state.reload();
                    questionsSrvc.isWaiting(false);
                });
            },
            showDeleteAlert: function ($event, questionId) {
                $event.stopPropagation();

                if (sectionsSrvc.getNumSections() === 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question from global list!',
                        template: 'Questions can only be deleted via the relevant section.'
                    });
                } else if (sectionsSrvc.getNumSections() > 0) {
                    var question = questionsSrvc.getQuestionAt(questionId);
                    $ionicPopup.confirm({
                        title: 'Delete Question',
                        template: 'Are you sure you want to delete \'' + question.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {

                            var removeIndex = vm.questions.findIndex(quest => quest.id === questionId);
                            vm.questions.splice(removeIndex, 1);
                            var section = sectionsSrvc.getSectionAt(vm.parentSectionId);
                            section.questionIds.splice(removeIndex, 1);
                            sectionsSrvc.updateSection(section);
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
           
        });
    }
}());
