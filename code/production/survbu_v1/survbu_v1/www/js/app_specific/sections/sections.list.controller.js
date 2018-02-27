/*global angular, console */
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
        var vm = angular.extend(this, {
            parentSurvey: $state.params.parentSurvey,
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
            selectDetail: function (section) {
                $state.go('sections_detail', {
                    section: section
                });
            },
            listQuestions: function (section) {
                questionsSrvc.isWaiting(true);

                /* var selectedSection = sectionsSrvc.getSectionAt(index),
                     sectionQuestions = selectedSection.questionIds;*/
                var sectionQuestions = section.questionIds;

                $state.go('questions_list', {
                    parentSection: section,
                    parentSurvey: vm.parentSurvey
                });

                // sectionsSrvc.setCurrentSection(index); // needs to be removed with implementation of $stateParams

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
            showActionMenu: function ($event, section) {
                $event.stopPropagation();
                
                var selectedSection = section,
                    referenceCount = section.referenceCount,
                    hasQuestions = (!Array.isArray(selectedSection.questionIds) || !selectedSection.questionIds.length) ? 'This section has no associated questions.' : 'Questions will be kept.';
                
                $ionicActionSheet.show({
                    titleText: 'Modify \'' + selectedSection.heading + '\'',
                    cancelText: 'Cancel',
                    buttons: [{
                        text: 'Edit survey details'
                    }],
                    destructiveText: 'Delete',
                    destructiveButtonClicked: function () {
                        if (vm.parentSurvey === 0 && referenceCount > 0) {
                            $ionicPopup.alert({
                                title: 'Can\'t delete section, referenceCount is ' + referenceCount,
                                template: 'Sections from the global list can only be deleted if referenceCount is 0.'
                            });
                            return true; // Close action menu
                        } else if (vm.parentSurvey === 0 && (referenceCount === 0 || referenceCount === null)) {
                            $ionicPopup.confirm({
                                title: 'Delete Section',
                                template: 'Are you sure you want to section \'' + selectedSection.heading + '\'?'
                            }).then(function (response) {
                                if (response) {
                                    //vm.sections.splice(vm.sections.indexOf(selectedSection.id), 1); // Splice from the viewmodel?
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
                                var sectionIndex = vm.sections.indexOf(selectedSection.id);
                                vm.sections.splice(sectionIndex, 1); // Splice from the viewmodel
                                vm.parentSurvey.sectionIds.splice(sectionIndex, 1); // Remove this section from section list
                                surveysSrvc.updateSurvey(vm.parentSurvey);
                                
                                if (response === 1) { // If response is one, i.e user selected 'Delete Section'
                                    sectionsSrvc.deleteSection(selectedSection.id);// Delete section from API
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                            return true;
                        }
                    },
                    buttonClicked: function (buttonIndex) {
                        if (buttonIndex === 0) {
                            vm.selectDetail(selectedSection);
                        }
                        return true; // Close action menu
                    }
                });
            }
        });
    }
}());
