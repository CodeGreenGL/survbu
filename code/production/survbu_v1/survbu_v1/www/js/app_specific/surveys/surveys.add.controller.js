/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysAddCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
                surveys: [],
                survey: {
                    introductionMessage: "",
                    completionMessage: ""
                },
                createSurvey: function () {
                    surveysSrvc.createSurveyService(vm.survey.introductionMessage, vm.survey.completionMessage).then(function (response) {
                        var newSurvey = response;
                        sectionsSrvc.isWaiting(true);

                        $state.go('sections_list', { // Returns user to blank section list before updating sections to improve percieved responsiveness
                            parentSurvey: newSurvey
                        }).then(function () {
                            $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back
                            $state.reload(); // Refresh the state so back button doesn't display old data
                        });

                        sectionsSrvc.updateSections([]).then(function () { // Pass in empty array to update sections list with
                            sectionsSrvc.isWaiting(false);
                        });
                    });
                }
            });
    }
}());
