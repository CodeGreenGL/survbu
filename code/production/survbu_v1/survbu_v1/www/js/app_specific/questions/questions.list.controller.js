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
                            vm.parentSection.questionIds.splice(removeIndex, 1);
                            sectionsSrvc.updateSection(vm.parentSection).then(function(){
                                
                            });
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
           
        });
    }
}());
