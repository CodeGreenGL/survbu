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
            },
            createSurvey: function() {
                surveysSrvc.createSurvey(vm.survey.introductionMessage,vm.survey.completionMessage).then(function (response) {
                    //Returns the promised object   
                    return vm.listSections(response);
                });      
            },
            listSections: function(survey) {
                sectionsSrvc.isWaiting(true);
                var createdSurvey = survey;

                $state.go('sections_list', {
                    parentSurveyId: createdSurvey.id
                });
                sectionsSrvc.isWaiting(false);

                var surveySections = [];
                            
                sectionsSrvc.updateSections(surveySections).then(function () {
                    if (surveySections.length > 0) {
                        $state.reload();
                    };
                });
            }
        });
    }
}());
