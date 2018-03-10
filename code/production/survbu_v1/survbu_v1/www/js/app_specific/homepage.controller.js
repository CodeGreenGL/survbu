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

                    surveysSrvc.updateAllSurveys().then(function () {
                        surveysSrvc.isWaiting(false);
                        console.log(surveysSrvc.isItWaiting());
                        if (surveysSrvc.getNumSurveys() > 0) {
                            $state.reload();
                        }
                    });
                }, //end listAllSurveys function
                listAllSections: function () {
                    
                    sectionsSrvc.isWaiting(true);
                    $state.go('sections_global');
                    
                    sectionsSrvc.getAllSections().then(function () {
                        sectionsSrvc.isWaiting(false);
                        
                        if (sectionsSrvc.getNumAllSections() > 0) {
                            $state.reload();
                        }
                    });
                    
                }, //end listAllSections function
                listAllQuestions: function () {
                
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_global');

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
