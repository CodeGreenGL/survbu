/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysAddCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        surveysSrvc,
        sectionsSrvc
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                surveys: [],
                survey: {
                    introductionMessage: "",
                    completionMessage: ""
                }
            });

        vm.createSurvey = function() {
            /*surveysSrvc.createSurveyService(surveyTitle,surveyDescription).then(function (response) {
                //Returns the promised object
                return listSections(response);
            }); */
            surveysSrvc.createSurveyService(vm.survey.introductionMessage,vm.survey.completionMessage).then(function (response) {
                //Returns the promised object
                
                return listSections(response);
            });
            
        };

        //possible needs to be renamed to more appropriate name.
        var listSections = function(surveyObject)
        {
            sectionsSrvc.isWaiting(true);

            var selectedSurvey = surveyObject['id'];
            

            $state.go('sections_list', {
                parentSurvey: selectedSurvey
            });

            var surveySections = [];
                        
            sectionsSrvc.updateSections(surveySections).then(function () {
                sectionsSrvc.isWaiting(false);
                if (surveySections.length > 0) {
                    $state.reload();
                };
            });
        };

        //vm.survey = surveysSrvc.getSectionAt(params.selected);

    }
}());
