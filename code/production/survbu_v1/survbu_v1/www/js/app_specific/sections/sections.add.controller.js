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
        var parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
                section: {
                    heading: "",
                    introductionMessage: ""
                },
                createSection: function () {
                    sectionsSrvc.createSection(vm.section.heading, vm.section.introductionMessage).then(function (response) {
                        var newSection = response;
                        vm.parentSurvey.sectionIds.push(newSection.id);
                        surveysSrvc.updateSurvey(vm.parentSurvey).then(function (response) {
                            surveysSrvc.updateAllSurveys().then(function () {
                                listQuestions(newSection);
                            });
                        });
                    });
                }
            }),
            listQuestions = function (newSection) {
                questionsSrvc.isWaiting(true);

                var sectionQuestions = [];
                $state.go('questions_list', {
                    parentSectionId: newSection.id,
                    parentSurveyId: vm.parentSurvey.id
                });

                questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                    if (sectionQuestions.length > 0) {
                        $state.reload();
                    }
                    questionsSrvc.isWaiting(false);
                });
            };
    }
}());
