/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            questionChoices: [],
            parentSection: $stateParams.parentSection,
            parentSectionSurvey: $stateParams.parentSectionSurvey,
            question: {
                questionText: "",
                questionType: ""
            },
            displayAddQuestionChoices: function (questionType) {
                if (questionType === 'MULTIPLE_SELECT' || questionType === 'SINGLE_SELECT') {
                    return true;
                }
            },
            addChoice: function (addChoice) {
                vm.questionChoices.push(addChoice);
            },
            createQuestion: function () {
                questionsSrvc.createQuestionService(vm.question.questionType, vm.question.questionText, vm.questionChoices).then(function (response) {
                    questionsSrvc.isWaiting(true);
                    sectionsSrvc.isWaiting(true);
                    $ionicHistory.removeBackView();     // Remove question list (previous page) from ionic history

                    $state.go('questions_list', {       // Returns user to blank question list before updating questions to improve percieved responsiveness
                        parentSection: vm.parentSection,
                        parentSectionSurvey: vm.parentSectionSurvey
                    }).then(function () {
                        $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back
                        $state.reload();                // Refresh the state so back button doesn't display old data
                    });

                    var newQuestionID = response.id;
                    vm.parentSection.questionIds.push(newQuestionID);
                    questionsSrvc.isWaiting(false); // once new questionID added to array, allow user to view

                    // PUTs the new parentSection to API
                    sectionsSrvc.updateCreateSection(vm.parentSection).then(function () {
                        // Given an array of sectionIds, updates the section array with the retrieves section objects.
                        sectionsSrvc.updateSections(vm.parentSectionSurvey.sectionIds).then(function () {
                            sectionsSrvc.isWaiting(false);
                        });
                    });
                });
            }
        });
    }
}());
