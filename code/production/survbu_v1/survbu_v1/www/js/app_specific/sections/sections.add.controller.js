/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            parentSurvey: $stateParams.parentSurvey,
            section: {
                sectionHeading: "no text",
                sectionIntroductionMessage: "no type"
            },
            createSection: function () {
                sectionsSrvc.createSectionService(vm.section.sectionHeading, vm.section.sectionIntroductionMessage).then(function (response) {
                    var newSection = response;
                    vm.parentSurvey.sectionIds.push(newSection.id);
                    
                    surveysSrvc.updateCreateSurvey(vm.parentSurvey).then(function (response) {
                        console.log(response);

                        surveysSrvc.updateAllSurveys();
                        questionsSrvc.isWaiting(true);      // Update questions and return to question list state

                        $state.go('questions_list', {       // Returns user to blank question list before updating questions to improve percieved responsiveness
                            parentSection: newSection,
                            parentSectionSurvey: vm.parentSurvey
                        }).then(function () {
                            $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back
                            $state.reload();                // Refresh the state so back button doesn't display old data
                        });

                        questionsSrvc.updateQuestions([]).then(function () { // Update Question array with empty array.
                            questionsSrvc.isWaiting(false);
                        });
                    });
                });
            }
        });
    }
}());
