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

                        if (surveysSrvc.getSurveys().length > 0) {
                            $state.reload();
                        }
                    });
                }, //end listAllSurveys function
                listAllSections: function () {
                    surveysSrvc.disposeSurveys();
                    
                    sectionsSrvc.isWaiting(true);
                    $state.go('sections_list');

                    sectionsSrvc.updateAllSections().then(function () {
                        sectionsSrvc.isWaiting(false);

                        if (sectionsSrvc.getNumSections() > 0) {
                            $state.reload();
                        }
                    });
                }, //end listAllSections function
                listAllQuestions: function () {
                    sectionsSrvc.disposeSections();
                    
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_list'); //this needs sorting; it's going to be separate (global) list; this will have additional functionality

                    questionsSrvc.updateAllQuestions().then(function () {
                        questionsSrvc.isWaiting(false);

                        if (questionsSrvc.getNumAllQuestions() > 0) {
                            $state.reload();
                        }
                    });
                } //end listAllQuestions function
            }); //end angular.extend
    } //end function control (controller)
}());
