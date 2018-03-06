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
                        if (vm.sections[i].adding === true) { // Needs to update the reference count for all the sections added. ==> PAV - 6th-March
                            vm.parentSurvey.sectionIds.push(vm.sections[i].id);
                            vm.sections[i].referenceCount = vm.sections[i].referenceCount + 1;
                            for(var j = 0; j < vm.sections[i].questionIds.length; j++){ // add all the questions from added sections to our array
                                questions.push(vm.sections[i].questionIds[j]);
                            }
                           
                            //NEEDS TO HANDLE THE PROMSIES IN APPROPRIATE WAY => PAV
                            sectionsSrvc.updateSection(vm.sections[i]).then(function(section){
                                questionsSrvc.updateQuestions(section.questionIds).then(function (response) {
                                    for(var i = 0; i < questions.length; i++){
                                        var question = questionsSrvc.getQuestionAt(questions[i]);
                                        console.log(question);
                                        question.referenceCount = question.referenceCount + 1;
                                        questionsSrvc.updateQuestion(question).then(function(){});
                                    };
                                });
                            }); //Update the section's reference count  
                        } // NEeds to add the update for questions to update the ref.countxs
                    };      
                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function (response) {
                        surveysSrvc.updateAllSurveys().then(function () {           
                            sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function (response) {
                                $state.go('sections_list', {
                                    parentSurveyId: vm.parentSurvey.id
                                });
                            });
                        });
                    });
                }
        });
    }
}());
