/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'questionsSrvc',
        'sectionsSrvc',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        questionsSrvc,
        sectionsSrvc,
        surveysSrvc
    ) {
        var parentSectionId = $stateParams.parentSectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                 parentSection: sectionsSrvc.getSectionAt(parentSectionId),
                 parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
                 question: questionsSrvc.getQuestionAt($stateParams.questionId),

                 cancelEditing: function () {
                    $state.go('questions_list',{
                        parentSectionId: vm.parentSection.id,
                        parentSurveyId: vm.parentSurvey.id
                    });
                 },
                 containsChoices: function() {
                    if(vm.question.questionType === "MULTIPLE_SELECT" || vm.question.questionType === "SINGLE_SELECT"){
                       return true; 
                    }
                    return false;
                 },
                 addChoice: function (addChoice) {
                    vm.question.questionChoices.push(addChoice);
                 },
                 updateQuestion: function(){
                    console.log("inside updateQuestion");
                    questionsSrvc.updateQuestion(vm.question).then(function(){
                        questionsSrvc.updateQuestions(vm.parentSection.questionIds).then(function(){
                            $state.go('questions_list',{
                            parentSectionId: vm.parentSection.id,
                            parentSurveyId: vm.parentSurvey.id
                            });
                        });    
                    });
                 },
                 referenceCount: function(){
                    if(vm.question.referenceCount > 1){return true;}
                    else{return false;} 
                 },
            });
        }
}());
