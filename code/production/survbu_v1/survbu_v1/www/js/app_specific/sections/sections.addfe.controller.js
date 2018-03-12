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
                                                //THIS SHOULD WORK, BUT RESTLET DOESN'T REFRESH THE UPDATED QUESTIONS IN TIME FOR THEM TO BE RETRIEVED FOR FURTHER REFERENCE COUNT INCREMENT,
                                                //WHICH RESULTS IN RACE CONDITION.
                                                //THE ONLY SOLUTION SEEMS TO BE TO PUT ALL QUESTIONS FOR UPDATING INTO ONE ARRAY AND, WHEN ONE QUESTION IS IN MORE THAN ONE ADDED SECTION, INCREMENT
                                                //THE REF_COUNT VALUE ONE MORE TIME BEFORE FINALLY UPDATING TO THE BACKEND
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
                                    if ( j+1 === questions.length) {
                                        $q.all(promisesQ).then(function () {
                                            for (var i = 0; i < vm.sections.length; i++) {
                                                promisesS.push(sectionsSrvc.updateSection(vm.sections[i]));
                                            }
                                        });
                                        promisesQ = [];
                                    }
                                };
                            });
                        }
                    };

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
