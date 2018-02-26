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
                    surveysSrvc.isWaiting(true);
                    $state.go('surveys_list');
                }, //end listAllSurveys function
                listAllSections: function () {
                    sectionsSrvc.isWaiting(true);
                    $state.go('sections_list');
                }, //end listAllSections function
                listAllQuestions: function () {
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_list');
                } //end listAllQuestions function
            }); //end angular.extend
    } //end function control (controller)
}());
