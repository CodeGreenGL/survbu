/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('homepageCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            listAllSurveys: function () {
                $state.go('surveys_list');
            },
            listAllSections: function () {
                sectionsSrvc.isWaiting(true);
                $state.go('sections_list');
            },
            listAllQuestions: function () {
                questionsSrvc.isWaiting(true);
                $state.go('questions_list');
            }
        }); //end angular.extend
    } //end function control (controller)
}());
