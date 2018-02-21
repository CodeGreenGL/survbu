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
                survey: {
                    introductionMessage: "",
                    completionMessage: ""
                }
            });

        vm.createSurvey = function() {
            surveysSrvc.createSurveyService(vm.survey.introductionMessage,vm.survey.completionMessage).then(function (response) {
                //Returns the promised object   
                return listSections(response);
            });
            
        };

        //possible needs to be renamed to more appropriate name.
        var listSections = function(surveyObject) {
            sectionsSrvc.isWaiting(true);
            var createdSurvey = surveyObject;
            sectionsSrvc.disposeSections();

            $state.go('sections_list', {
                parentSurvey: createdSurvey
            });
            sectionsSrvc.isWaiting(false);

            /*var surveySections = [];
                        
            sectionsSrvc.updateSections(surveySections).then(function () {
                
                if (surveySections.length > 0) {
                    $state.reload();
                };
            }); */
        };
    }
}());
