/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc'
    ];

    function control(
        $state,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {
            survey: surveysSrvc.getSurveyAt($state.params.surveyId),
            submitButton: function () {
                $state.go('surveys_list');
            },
            cancelEditing: function () {
                $state.go('surveys_list');
            },
            updateSurvey: function () {
                surveysSrvc.updateSurvey(vm.survey).then(function (response) {

                    return vm.listSurveys(response);
                });
            },
            listSurveys: function (survey) {
                surveysSrvc.updateAllSurveys().then(function () {
                    $state.go('surveys_list', {
                        parentSurveyId: survey.id  //response may be renamed to survey and response.id => survey.id
                    });
                });
            }
        });
    }
}());
