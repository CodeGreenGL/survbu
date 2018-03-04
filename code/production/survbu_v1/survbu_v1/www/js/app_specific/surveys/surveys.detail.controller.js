/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        surveysSrvc
    ) {
        var surveyId = $stateParams.surveyId,
            vm = angular.extend(this, {
            survey: surveysSrvc.getSurveyAt(surveyId),
            submitButton: function () {
                $state.go('surveys_list');
            },
            updateSurvey: function () {
                surveysSrvc.updateSurvey(vm.survey.id,vm.survey.introductionMessage,vm.survey.completionMessage,vm.survey.sectionIds).then(function (response) {
                    //Returns the promised object   
                    return vm.listSurveys(response);
                });   
            },
            listSurveys: function(survey){
                surveysSrvc.updateAllSurveys().then(function(){
                    $state.go('surveys_list', {
                        parentSurveyId: survey.id  //response may be renamed to survey and response.id => survey.id
                    });
                })
            }
        });
    }
}());
