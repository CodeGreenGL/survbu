/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc,
        questionsSrvc
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                section: {
                    sectionHeading: "no text",
                    sectionIntroductionMessage: "no type"
                }
            });

        vm.createSection = function(sectionHeading,sectionIntroductionMessage) {
            sectionsSrvc.createSectionService(sectionHeading,sectionIntroductionMessage).then(function(response){
                //Returns the promise object
                return listQuestions(response);
            });
        };

        //possible needs to be renamed to more appropriate name.
        var listQuestions = function(sectionObject){
            questionsSrvc.isWaiting(false);
            $state.go('questions_list');

            /*var selectedSection = sectionsSrvc.getSectionAt(index),
                sectionQuestions = selectedSection['questionIds'];

            questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                if (sectionQuestions.length > 0) {
                    $state.reload();
                };
                questionsSrvc.isWaiting(false);
            })*/
        }

        //vm.survey = surveysSrvc.getSectionAt(params.selected);

    }
}());