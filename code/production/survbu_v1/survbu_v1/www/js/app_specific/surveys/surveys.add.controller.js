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
                    introductionMessage: "no text",
                    completionMessage: "no type"
                }
            });

        vm.createSurvey = function(surveyTitle,surveyDescription) {
            surveysSrvc.createSurveyService(surveyTitle,surveyDescription).then(function (response) {
                //Returns the promised object
                return listSections(response);
            });
            
        };

        //possible needs to be renamed to more appropriate name.
        var listSections = function(surveyObject)
        {
            sectionsSrvc.isWaiting(false);
            $state.go('sections_list');

            /*var selectedSurvey = surveysSrvc.getSectionAt(index),
                surveySections = selectedSurvey['sectionIds']; */

               
            /*sectionsSrvc.updateSections(surveyObject.ID).then(function () {
                if (index.length > 0) {
                    $state.reload();
                };
                sectionsSrvc.isWaiting(false);
            });*/
        }

        //vm.survey = surveysSrvc.getSectionAt(params.selected);

    }
}());
