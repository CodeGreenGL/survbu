/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsAddCtrl', control);

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
        var params = $stateParams,
            vm = angular.extend(this, {
                parentSection : params.parentSection,
                parentSectionSurvey : params.parentSectionSurvey,
                question: {
                    questionText: "",
                    questionType: ""
                }
            });

        var test = function(parentSectionSurvey){
            console.log("this is parentSectionSurvey");
            console.log(vm.parentSectionSurvey);
            console.log(vm.parentSection);
        };

        test();


        vm.createQuestion = function() {

            questionsSrvc.createQuestionService(vm.question.questionText,vm.question.questionType).then(function(response){
                
                var newQuestionID = response['id'];

                console.log("Parent Sectiond ARRAY : TRUE STORY: !!!");
                console.log(vm.parentSection['questionIds']);

                vm.parentSection['questionIds'].push(newQuestionID); // NEEDS FURTHER ATTENCTION AS IT STILL BUGGY
                
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