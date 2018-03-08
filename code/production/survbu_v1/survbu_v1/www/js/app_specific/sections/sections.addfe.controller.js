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
                    
                    for (var i = 0; i < vm.sections.length; i++) {
                        var questions = [];
                        var promises = [];
                        if (vm.sections[i].adding === true) {
                            vm.parentSurvey.sectionIds.push(vm.sections[i].id);
                            vm.sections[i].referenceCount = vm.sections[i].referenceCount + 1;
                            questions = questionsSrvc.updateQuestions(vm.sections[i].questionIds);
                           
                            //NEEDS TO HANDLE THE PROMSIES IN APPROPRIATE WAY => PAV
                            sectionsSrvc.updateSection(vm.sections[i]).then(function(section){
                                questionsSrvc.updateQuestions(section.questionIds).then(function (response) {
                                    for(var j = 0; j < questions.length; j++){
                                        questions[j].referenceCount = questions[j].referenceCount + 1;
                                        promises.push(questionsSrvc.updateQuestion(questions[j]));
                                    };
                                });
                            });
                        }
                    };
                    $q.all(promises).then(function () {
                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function (response) {
                        surveysSrvc.updateAllSurveys().then(function () {           
                            sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function (response) {
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
