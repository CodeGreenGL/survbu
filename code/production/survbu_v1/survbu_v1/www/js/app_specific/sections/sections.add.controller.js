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
                            return listQuestions(newSection);
                        });
                    });
                }
            }),
            listQuestions = function (newSection) {
                questionsSrvc.isWaiting(true);

                // Returns user to blank question list before updating questions to improve percieved responsiveness
                $state.go('questions_list', {
                    parentSection: $stateParams.parentSection,
                    parentSectionSurvey: $stateParams.parentSectionSurvey
                }).then(function () {
                    $ionicHistory.removeBackView(); // Delete trace of add page (previous page) from ionic history
                });

                // Update Question array with empty array.
                questionsSrvc.updateQuestions([]).then(function () {
                    questionsSrvc.isWaiting(false);
                });
            };
    }
}());
