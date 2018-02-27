/*global angular */
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
                heading: "",
                introductionMessage: ""
            },
            createSection: function () {
                var sectionObject = {
                    introductionMessage: vm.section.introductionMessage,
                    heading: vm.section.heading,
                    questionChoices: vm.questionChoices,
                    referenceCount: ((vm.parentSurvey === 0) ? 0 : 1) // Set referenceCount to 0 if there is no parentSection, i.e from global list
                };
                surveysSrvc.isWaiting(true);
                sectionsSrvc.isWaiting(true);

                sectionsSrvc.createSection(sectionObject).then(function (response) {
                    sectionsSrvc.isWaiting(false);
                    console.log(response);
                    var newSection = response;
                    vm.parentSurvey.sectionIds.push(newSection.id);

                    $state.go('questions_list', { // Returns user to blank question list before updating questions to improve percieved responsiveness
                        parentSurvey: vm.parentSurvey,
                        parentSection: newSection
                    }).then(function () {
                        $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back

                        if (vm.parentSurvey === 0) {
                            surveysSrvc.isWaiting(false); // If from global list, stop survey service from waiting since nothing needs to be done further
                        } else if (vm.parentSurvey !== 0) { // --- this section needs to be revised ---
                            // PUTs the new parentSection to API
                            surveysSrvc.updateSurvey(vm.parentSurvey).then(function () {
                                // Updates the entire surveys list with a fresh GET
                                surveysSrvc.updateAllSurveys().then(function () {
                                    surveysSrvc.isWaiting(false);
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
