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
            parentSection: $stateParams.parentSection,
            parentSurvey: $stateParams.parentSurvey,
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
            createQuestion: function () {
                var questionObject = {
                    questionType: vm.question.questionType,
                    questionText: vm.question.questionText,
                    questionChoices: vm.questionChoices,
                    referenceCount: ((vm.parentSection === 0) ? 0 : 1) // Set referenceCount to 0 if there is no parentSection, i.e from global list
                };
                
                questionsSrvc.isWaiting(true);
                sectionsSrvc.isWaiting(true);
                
                questionsSrvc.postQuestion(questionObject).then(function (response) {
                    var newQuestionID = response.id;
                    
                    $ionicHistory.removeBackView();

                    $state.go('questions_list', { // Returns user to blank question list before updating questions to improve percieved responsiveness
                        parentSurvey: vm.parentSurvey,
                        parentSection: vm.parentSection
                    }).then(function () {
                        $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back

                        if (vm.parentSection === 0) { // stop list from showing updating if no parent section, i.e global list
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

                        $state.reload(); // Refresh the state so back button doesn't display old data
                    });
                });
            }
        });
    }
}());
