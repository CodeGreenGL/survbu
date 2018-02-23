/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicActionSheet',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicActionSheet,
        $ionicPopup,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var stateParams = $state.params,
            vm = angular.extend(this, {
                parentSurvey: stateParams.parentSurvey,
                sections: sectionsSrvc.returnSections(),
                stillWaiting: function () {
                    return sectionsSrvc.isItWaiting();
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
                addSection: function addSection() {
                    $state.go('sections_add', {
                        parentSurvey: vm.parentSurvey
                    });
                },
                selectDetail: function (index) {
                    $state.go('sections_detail', {
                        selected: index
                    });
                },
                listQuestions: function (index) {
                    questionsSrvc.isWaiting(true);

                    var selectedSection = sectionsSrvc.getSectionAt(index),
                        sectionQuestions = selectedSection.questionIds;

                    $state.go('questions_list', {
                        parentSection: selectedSection,
                        parentSectionSurvey: vm.parentSurvey
                    });

                    sectionsSrvc.setCurrentSection(index); // needs to be removed with implementation of $stateParams

                    if (sectionQuestions.length > 0) {
                        questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                            $state.reload();
                            questionsSrvc.isWaiting(false);
                        });
                    } else {
                        questionsSrvc.disposeQuestions();
                        questionsSrvc.isWaiting(false);
                    }
                },
                showActionMenu: function ($event, index) {
                    $event.stopPropagation();

                    var selectedSection = sectionsSrvc.getSectionAt(index),
                        hasQuestions = (!Array.isArray(selectedSection.questionIds) || !selectedSection.questionIds.length) ? 'This section has no associated questions.' : 'Questions will be kept.'; //TRUE=empty array
                    $ionicActionSheet.show({
                        titleText: 'Modify \'' + selectedSection.heading + '\'',
                        cancelText: 'Cancel',
                        buttons: [{
                            text: 'Edit survey details'
                        }],
                        destructiveText: 'Delete',
                        destructiveButtonClicked: function () {
                            var selectedSection = vm.sections[index],
                                referenceCount = selectedSection.referenceCount;

                            console.log("section[" + index + "] - referenceCount: " + referenceCount);

                            if (vm.parentSurvey === 0 && referenceCount > 0) {
                                $ionicPopup.alert({
                                    title: 'Can\'t delete section, referenceCount is ' + referenceCount,
                                    template: 'Sections from the global list can only be deleted if referenceCount is 0.'
                                });
                                return true; // Close action menu
                            } else if (vm.parentSurvey === 0 && referenceCount === 0 || referenceCount === null) {
                                $ionicPopup.confirm({
                                    title: 'Delete Section',
                                    template: 'Are you sure you want to section \'' + selectedSection.heading + '\'?'
                                }).then(function (response) {
                                    if (response) {
                                        vm.sections.splice(index, 1);
                                        sectionsSrvc.deleteSection(selectedSection.id);
                                        console.log('DELETED section object');
                                    } else {
                                        console.log('User pressed cancel');
                                    }
                                });
                                return true; // Close action menu
                            } else if (referenceCount > 1) {
                                $ionicPopup.alert({
                                    title: 'Can\'t delete section, referenceCount is ' + referenceCount,
                                    template: 'This section is used in ' + referenceCount + ' surveys, and cannot be deleted.'
                                });
                                return true; // Close action menu
                            } else if (referenceCount === 0 || referenceCount === 1 || referenceCount === null) { // null part can be removed when questions are cleaned
                                // referenceCount should only have values of 0 or 1 or above in cleaned questions
                                $ionicPopup.show({
                                    title: 'Delete \'' + selectedSection.heading + '\'',
                                    cssClass: 'extendedDeletePopup',
                                    template: 'Section will be removed from survey. Would you like to delete section object too?<br/><br/>' + hasQuestions,
                                    buttons: [{
                                        text: 'Cancel',
                                        type: 'button-light'
                                    }, {
                                        text: 'Keep Section',
                                        type: 'button-calm',
                                        onTap: function () {
                                            return 0;
                                        }
                                    }, {
                                        text: 'Delete Section',
                                        type: 'button-assertive',
                                        onTap: function () {
                                            return 1;
                                        }
                                    }]
                                }).then(function (response) {
                                    if (response === 0) {
                                        vm.sections.splice(index, 1);
                                        surveysSrvc.updateSurvey(selectedSection.id);
                                        console.log('Deleted Section from Survey, KEPT section object');
                                    } else if (response === 1) {
                                        vm.sections.splice(index, 1);
                                        sectionsSrvc.deleteSection(selectedSection.id);
                                        surveysSrvc.updateSurvey(selectedSection.id);
                                        console.log('Deleted Section from Survey, DELETED section object');
                                    } else {
                                        console.log('User pressed cancel');
                                    }
                                    return true; // Close action menu
                                });
                            }
                        },
                        buttonClicked: function (buttonIndex) {
                            if (buttonIndex === 0) {
                                vm.selectDetail(index);
                            }
                            return true; // Close action menu
                        }
                    });
                }
            });
    }
}());
