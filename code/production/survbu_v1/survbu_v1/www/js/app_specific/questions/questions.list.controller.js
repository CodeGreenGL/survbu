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
            parentSection: $stateParams.parentSection,
            parentSurvey: $stateParams.parentSurvey,
            questions: ($stateParams.parentSection) ? questionsSrvc.getQuestions() : questionsSrvc.returnAllQuestions(),
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
            selectDetail: function selectDetail(index) {
                $state.go('questions_detail', {
                    selected: index
                });
            },
            addQuestion: function () {
                $state.go('questions_add', {
                    parentSection: vm.parentSection,
                    parentSurvey: vm.parentSurvey
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
            showDeleteAlert: function ($event, questionID) {
                $event.stopPropagation();

                if (sectionsSrvc.getNumSections() === 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question from global list!',
                        template: 'Questions can only be deleted via the relevant section.'
                    });
                } else if (sectionsSrvc.getNumSections() > 0) {
                    var selectedQuestion = questionsSrvc.getQuestionAt(questionID);
                    $ionicPopup.confirm({
                        title: 'Delete Question',
                        template: 'Are you sure you want to delete \'' + selectedQuestion.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {
                            vm.questions.splice(vm.questions.indexOf(questionID), 1);
                            vm.parentSection.questionIds.splice
                            sectionsSrvc.updateSection(vm.parentSection);
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
           
        });
    }
}());
