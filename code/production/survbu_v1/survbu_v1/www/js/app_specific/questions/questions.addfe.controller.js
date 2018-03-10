/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt($state.params.parentSectionId),
            parentSurvey: surveysSrvc.getSurveyAt($state.params.parentSurveyId),
            questions: questionsSrvc.getRemainingQuestions(),

            stillWaiting: function () {
                return questionsSrvc.isItWaiting();
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
                        questionsSrvc.updateQuestion(vm.questions[i]).then(function () {}); //update the reference count ==> PAV 06/03/2018 //this should just add to pool of promises and not wait for its execution [K]
                    }
                };
                sectionsSrvc.updateSection(vm.parentSection).then(function (response) { // should not change the reference count //this should only start once all the above questions get updated [K]
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
