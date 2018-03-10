/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsDetailGlobalCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
                question: questionsSrvc.getQuestionAtGlobal($stateParams.questionId),

                cancelEditing: function () {
                    $state.go('questions_global');
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
                    questionsSrvc.updateQuestion(vm.question).then(function(){
                        questionsSrvc.getAllQuestions().then(function () {
                            $state.go('questions_global');
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
