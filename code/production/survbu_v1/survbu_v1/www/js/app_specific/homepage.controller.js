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
                }, //end listAllSurveys function
                listAllSections: function () {
                    $state.go('sections_list');
                }, //end listAllSections function
                listAllQuestions: function () {
                    sectionsSrvc.disposeSections();
                    
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_list');

                    questionsSrvc.getAllQuestions().then(function () {
                        questionsSrvc.isWaiting(false);

                        if (questionsSrvc.getNumAllQuestions() > 0) {
                            $state.reload();
                        }
                    });
                } //end listAllQuestions function
            }); //end angular.extend
    } //end function control (controller)
}());
