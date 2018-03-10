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
                    $state.go('sections_list',{
                        parentSurvey : 0
                    });
                    
                    sectionsSrvc.getAllSections().then(function () {
                        sectionsSrvc.isWaiting(false);
                        
                        if (sectionsSrvc.getNumSections() > 0) {
                            $state.reload();
                        }
                    });
                    
                }, //end listAllSections function
                listAllQuestions: function () {
                
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_list',{
                        parentSection : 0,
                        parentSectionSurvey : 0
                    }); //this needs sorting; it's going to be separate (global) list; this will have additional functionality

                    questionsSrvc.getAllQuestions().then(function () {
                        console.log(questionsSrvc.returnAllQuestions());
                        questionsSrvc.isWaiting(false);

                        if (questionsSrvc.getNumAllQuestions() > 0) {
                            $state.reload();
                        }
                    });
                } //end listAllQuestions function
            }); //end angular.extend
    } //end function control (controller)
}());
