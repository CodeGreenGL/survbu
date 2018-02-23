/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            parentSurvey: $state.params.parentSurvey,
            section: {
                sectionHeading: "no text",
                sectionIntroductionMessage: "no type"
            },
            createSection: function () {
                var sectionObject = {
                    introductionMessage: vm.section.sectionIntroductionMessage,
                    heading: vm.section.sectionHeading,
                    questionChoices: vm.questionChoices,
                    referenceCount: ((vm.parentSurvey === 0) ? 0 : 1) // Set referenceCount to 0 if there is no parentSection, i.e from global list
                };

                surveysSrvc.isWaiting(true);
                sectionsSrvc.isWaiting(true);

                sectionsSrvc.postSection(sectionObject).then(function (response) {
                    sectionsSrvc.isWaiting(false);
                    var newSection = response;

                    $ionicHistory.removeBackView(); // Remove question list (previous page) from ionic history

                    $state.go('questions_list', { // Returns user to blank question list before updating questions to improve percieved responsiveness
                        parentSection: newSection,
                        parentSectionSurvey: vm.parentSurvey
                    }).then(function () {
                        $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back

                        if (vm.parentSurvey === 0) {
                            surveysSrvc.isWaiting(false); // If from global list, stop survey service from waiting since nothing needs to be done further
                        } else if (vm.parentSurvey !== 0) { // --- this section needs to be revised ---
                            vm.parentSurvey.sectionIds.push(newSection.id);

                            // PUTs the new parentSection to API
                            surveysSrvc.putSurvey(vm.parentSurvey).then(function (response) {
                                // Updates the entire surveys list with a fresh GET
                                surveysSrvc.updateAllSurveys().then(function () {
                                    surveysSrvc.isWaiting(false);
                                });
                            });
                        }

                        $state.reload(); // Refresh the state so back button doesn't display old data
                    });
                });

                //sectionsSrvc.postSection(vm.section.sectionHeading, vm.section.sectionIntroductionMessage).then(function (response) {
                //    var newSection = response;
                //    vm.parentSurvey.sectionIds.push(newSection.id);
                //    
                //    surveysSrvc.putSurvey(vm.parentSurvey).then(function (response) {
                //        console.log(response);

                //        surveysSrvc.updateAllSurveys();
                //        questionsSrvc.isWaiting(true);      // Update questions and return to question list state

                //        $state.go('questions_list', {       // Returns user to blank question list before updating questions to improve percieved responsiveness
                //            parentSection: newSection,
                //            parentSectionSurvey: vm.parentSurvey
                //        }).then(function () {
                //            $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back
                //            $state.reload();                // Refresh the state so back button doesn't display old data
                //        });

                //        questionsSrvc.updateQuestions([]).then(function () { // Update Question array with empty array.
                //            questionsSrvc.isWaiting(false);
                //        });
                //    });
                //});
            }
        });
    }
}());
