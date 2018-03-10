/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddfeCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        '$q',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        $q,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
      	var parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
                sections: sectionsSrvc.getRemainingSections(),

                stillWaits: sectionsSrvc.isItWaiting(),
                stillWaiting: function () {
                    return vm.stillWaits;
                },
                noContent: function () {
                    return vm.sections.length === 0;
                },
                hideList: function () {
                    return (vm.stillWaiting() || vm.noContent());
                },
                hideNoItems: function () {
                    return (vm.stillWaiting() || !vm.noContent());
                },
                addSections: function () {
                    
                    var promisesS = [];
                    var promisesQ = [];
                    for (var i = 0; i < vm.sections.length; i++) {
                        if (vm.sections[i].adding === true) {
                            vm.parentSurvey.sectionIds.push(vm.sections[i].id);
                            vm.sections[i].referenceCount = vm.sections[i].referenceCount + 1;

                            questionsSrvc.updateQuestions(vm.sections[i].questionIds).then(function (questions) {
                                for (var j = 0; j < questions.length; j++) {
                                    questions[j].referenceCount = questions[j].referenceCount + 1;
                                    promisesQ.push(questionsSrvc.updateQuestion(questions[j]));
                                };
                            });
                        }
                    };

                    $q.all(promisesQ).then(function () {
                        for (var i = 0; i < vm.sections.length; i++) {
                            promisesS.push(sectionsSrvc.updateSection(vm.sections[i]));
                        }
                    });

                    $q.all(promisesS).then(function () {
                        sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                            surveysSrvc.updateSurvey(vm.parentSurvey).then(function () {
                                surveysSrvc.updateAllSurveys().then(function () { 
                                    $state.go('sections_list', {
                                        parentSurveyId: vm.parentSurvey.id
                                    });
                                });
                            });
                        });
                    });
                }
        });
    }
}());
