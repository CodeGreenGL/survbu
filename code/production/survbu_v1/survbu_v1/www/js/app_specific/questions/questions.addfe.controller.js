/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddfeCtrl', control);

    control.$inject = [
        '$stateParams',
        '$ionicHistory',
        '$q',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $stateParams,
        $ionicHistory,
        $q,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        questionsSrvc.isWaiting(true);
        questionsSrvc.updateRemainingQuestions().then(function (response) {
            vm.questions = response;
            questionsSrvc.isWaiting(false);
        });
        var vm = angular.extend(this, {
            parentSection: sectionsSrvc.getSectionAt($stateParams.sectionId),
            parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
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
                var i,
                    promisesQ = [];
                for (i = 0; i < vm.questions.length; i = i + 1) {
                    if (vm.questions[i].adding === true) {
                        vm.parentSection.questionIds.push(vm.questions[i].id);
                        vm.questions[i].referenceCount = vm.questions[i].referenceCount + 1;
                        promisesQ.push(questionsSrvc.updateQuestion(vm.questions[i]));
                    }
                }
                $q.all(promisesQ).then(function () {
                    sectionsSrvc.updateSection(vm.parentSection).then(function () {
                        sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                            questionsSrvc.updateQuestions(vm.parentSection.questionIds).then(function () {
                                $ionicHistory.goBack();
                            });
                        });
                    });
                });
            }
        });
    }
}());
