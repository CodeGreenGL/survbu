/*global angular, console */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicPopup',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicPopup,
        sectionsSrvc,
        questionsSrvc
    ) {
        var stateParams = $state.params,
            vm = angular.extend(this, {
                parentSection: stateParams.parentSection,
                parentSurvey: stateParams.parentSurvey,
                questions: (stateParams.parentSection) ? questionsSrvc.getQuestions() : questionsSrvc.returnAllQuestions(),
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
                selectDetail: function selectDetail(index) {
                    $state.go('questions_detail', {
                        selected: index
                    });
                },
                addQuestion: function () {
                    $state.go('questions_add', {
                        parentSection: vm.parentSection,
                        parentSurvey: vm.parentSurvey
                    });
                },
                addFromExisting: function () {
                    questionsSrvc.isWaiting(true);
                    $state.go('questions_addfe', {
                        parentSection: vm.parentSection,
                        parentSurvey: vm.parentSurvey
                    });
                    questionsSrvc.updateRemainingQuestions().then(function () {
                        $state.reload();
                        questionsSrvc.isWaiting(false);
                    });
                },
                showDeleteAlert: function ($event, index) {
                    $event.stopPropagation();

                    var selectedQuestion = vm.questions[index],
                        referenceCount = selectedQuestion.referenceCount;

                    console.log("question[" + index + "] - referenceCount: " + referenceCount);

                    if (vm.parentSection === 0 && referenceCount > 0) {
                        $ionicPopup.alert({
                            title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                            template: 'Questions from the global list can only be deleted if referenceCount is 0.'
                        });
                    } else if (referenceCount > 1) {
                        $ionicPopup.alert({
                            title: 'Can\'t delete question, referenceCount is ' + referenceCount,
                            template: 'This question is used in ' + referenceCount + ' sections, and cannot be deleted.'
                        });
                    } else if (referenceCount === 0 || referenceCount === 1 || referenceCount === null) { // null and 0 part can be removed when questions are cleaned
                        // referenceCount should only have values of 1 or above in cleaned questions (i.e ref 1 for only being in that section, any more for being used in multiple)
                        $ionicPopup.confirm({
                            title: 'Delete Question',
                            template: 'Are you sure you want to delete \'' + selectedQuestion.questionText + '\'?'
                        }).then(function (response) {
                            if (response) {
                                vm.questions.splice(index, 1); // Remove the question at the index of the questions list
                                questionsSrvc.deleteQuestion(selectedQuestion.id); // can put a .then here for error checking the delete response from promise
                                if (vm.parentSection !== 0) { sectionsSrvc.updateSectionsFromQuestionID(selectedQuestion.id, vm.parentSection.id); } // if not in the global list, update the sections list
                            } else {
                                console.log('User pressed cancel');
                            }
                        });
                    }

                }

            });
    }
}());
