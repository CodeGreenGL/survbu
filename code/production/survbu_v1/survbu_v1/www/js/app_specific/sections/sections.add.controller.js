/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                parentSurvey : params.parentSurvey,
                section: {
                    sectionHeading: "no text",
                    sectionIntroductionMessage: "no type"
                }
            });

            console.log("INSIDE ADD");
            console.log(vm.parentSurvey['sectionIds']);

        vm.createSection = function() {

            sectionsSrvc.createSectionService(vm.section.sectionHeading,vm.section.sectionIntroductionMessage).then(function(response){
                
                var newSectionID = response['id'];
                vm.parentSurvey['sectionIds'].push(newSectionID);
                surveysSrvc.updateSurveyDetails(vm.parentSurvey).then(function(response){
                    reloadSurveys();
                });
                

                //Returns the promise object
                return listQuestions();
            });
        };

        var reloadSurveys = function () {
            //surveysSrvc.isWaiting(true);
            //$state.go('surveys_list');
            
            surveysSrvc.updateSurveys().then(function () {
                //surveysSrvc.isWaiting(false);
                //$state.reload();
            });
        }

        //possible needs to be renamed to more appropriate name.
        var listQuestions = function(){
            questionsSrvc.isWaiting(false);
            $state.go('questions_list'); //Send param in here - need to send the section object to question list
        }


    }
}());