/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicPopup',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicPopup,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            questions: questionsSrvc.getQuestions(),
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
            showDeleteAlert: function ($event, index) {
                $event.stopPropagation();

                if (sectionsSrvc.getNumSections() === 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete question from global list!',
                        template: 'Questions can only be deleted via the relevant section.'
                    });
                } else if (sectionsSrvc.getNumSections() > 0) {
                    var selectedQuestion = questionsSrvc.getQuestionAt(index);
                    $ionicPopup.confirm({
                        title: 'Delete Question',
                        template: 'Are you sure you want to delete \'' + selectedQuestion.questionText + '\'?'
                    }).then(function (response) {
                        if (response) {
                            console.log('User confirmed action');
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
        });
    }
}());
