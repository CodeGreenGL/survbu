/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysAddCtrl', control);

    control.$inject = [
        '$state',
        '$ionicHistory',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $ionicHistory,
        surveysSrvc,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            survey: {
                introductionMessage: "",
                completionMessage: ""
            },
            createSurvey: function () {
                var surveyObject = {
                    introductionMessage: vm.survey.introductionMessage,
                    completionMessage: vm.survey.completionMessage,
                    sectionIds: []
                };
                surveysSrvc.createSurvey(surveyObject).then(function (response) {
                    var newSurvey = response;
                    sectionsSrvc.updateSections([]);

                    $state.go('sections_list', { // Returns user to blank section list before updating sections to improve percieved responsiveness
                        surveyId: newSurvey.id
                    }).then(function () {
                        $ionicHistory.removeBackView(); // Remove add page (previous page) from ionic history, so user returns to sections list on back
                        sectionsSrvc.isWaiting(false);
                        $state.reload(); // Refresh the state so back button doesn't display old data
                    });
                });
            }
        });
    }
}());
