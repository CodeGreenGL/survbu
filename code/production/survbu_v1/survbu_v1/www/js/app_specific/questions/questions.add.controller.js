/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

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
        var params = $stateParams,
            vm = angular.extend(this, {
                questionChoices : [],
                parentSection : params.parentSection,
                parentSectionSurvey : params.parentSectionSurvey,
                question: {
                    questionText: "",
                    questionType: ""
                },
            });


        vm.displayAddQuestionChoices = function(questionType){
          if(questionType === 'MULTIPLE_SELECT' || questionType === 'SINGLE_SELECT')
            {return true;}
        }

        vm.addChoice = function(addChoice){
            vm.questionChoices.push(addChoice);
        }


        vm.createQuestion = function() {
            questionsSrvc.createQuestionService(vm.question.questionText,vm.question.questionType, vm.questionChoices).then(function(response){
                
                var newQuestionID = response['id'];

                vm.parentSection['questionIds'].push(newQuestionID);
                
                sectionsSrvc.updateSectionDetails(vm.parentSection).then(function(response){
                    reloadSections(response);
                });
                //Returns the promise object
                return detailQuestion(response);
            });
        };

        var reloadSections = function (response) {
            //surveysSrvc.isWaiting(true);
            //$state.go('surveys_list');
            var parentSectionSurveySections = vm.parentSectionSurvey['sectionIds'];
            sectionsSrvc.updateSections(parentSectionSurveySections).then(function () {
                //surveysSrvc.isWaiting(false);
                //$state.reload();
            });
        }

        //possible needs to be renamed to more appropriate name.
        var detailQuestion = function(questionObject){
            
            vm.question = questionObject;

            /*var selectedSection = sectionObject,
                sectionQuestions = [];
                console.log(sectionQuestions.length);

            questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                if (sectionQuestions.length > 0) {
                    $state.reload();
                };
                questionsSrvc.isWaiting(false);
            }); */
        }


    }
}());