/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var parentSectionId = $stateParams.parentSectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                parentSection: sectionsSrvc.getSectionAt(parentSectionId),
                parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
                questions: questionsSrvc.getRemainingQuestions(),

                stillWaits: questionsSrvc.isItWaiting(),
                stillWaiting: function () {
                    return vm.stillWaits;
                },
                noContent: function () {
                    return vm.questions.length === 0;
                },
                hideList: function () {
                    return (vm.stillWaiting() || vm.noContent());
                },
                hideNoItems: function () {
                    return (vm.stillWaiting() || !vm.noContent());
                },
                addQuestions: function () {
                    for (var i = 0; i < vm.questions.length; i++) {
                        if (vm.questions[i].adding === true) {                         
                            vm.parentSection.questionIds.push(vm.questions[i].id);
                            vm.questions[i].referenceCount = vm.questions[i].referenceCount + 1; // add one more to the refrrence count for each
                            questionsSrvc.updateQuestion(vm.questions[i]).then(function(){}); //update the reference count ==> PAV 06/03/2018
                        }
                    };
                    sectionsSrvc.updateSection(vm.parentSection).then(function (response) { // should not change the reference count
                        var parentSurveySections = vm.parentSurvey.sectionIds;
                        sectionsSrvc.updateSections(parentSurveySections).then(function () {
                            var sectionQuestions = vm.parentSection.questionIds;
                            questionsSrvc.updateQuestions(sectionQuestions).then(function (response) {
                                $state.go('questions_list', {
                                    parentSectionId: vm.parentSection.id,
					parentSurveyId: vm.parentSurvey.id			
                                });
                            });
                        });
                    });
                }
        });
    }
}());
