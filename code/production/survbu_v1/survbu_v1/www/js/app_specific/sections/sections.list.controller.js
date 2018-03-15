/*global angular, console */
/* eslint no-console: 0*/
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        '$ionicActionSheet',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        $ionicActionSheet,
        $ionicPopup,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var isGlobal = $state.params.surveyId === 0;

        if (isGlobal) { // Update sections if global list, i.e no parent survey id
            sectionsSrvc.isWaiting(true);
            sectionsSrvc.getAllSections().then(function (responseSectionsArray) {
                vm.sections = responseSectionsArray;
                sectionsSrvc.isWaiting(false);
            });
        } else {
            sectionsSrvc.isWaiting(true);
            sectionsSrvc.updateSections(surveysSrvc.getSurveyAt($state.params.surveyId).sectionIds).then(function () {
                vm.sections = sectionsSrvc.returnSections();
                sectionsSrvc.isWaiting(false);
            });
        }
        var vm = angular.extend(this, {
            isGlobal: isGlobal,
            parentSurvey: surveysSrvc.getSurveyAt($stateParams.surveyId),
            sections: sectionsSrvc.returnSections(),
            allSections: sectionsSrvc.returnAllSections(),
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
            noContentAll: function () {
                return vm.allSections.length === 0;
            },
            hideListAll: function () {
                return (vm.stillWaiting() || vm.noContentAll());
            },
            hideNoItemsAll: function () {
                return (vm.stillWaiting() || !vm.noContentAll());
            },
            selectDetail: function (sectionId) {
                $state.go('sections_detail', {
                    surveyId: (isGlobal) ? 0 : vm.parentSurvey.id,
                    sectionId: sectionId
                });
            },
            showActionMenu: function ($event, sectionId) {
                $event.stopPropagation();

                var selectedSection = (isGlobal) ? sectionsSrvc.getSectionAtGlobal(sectionId) : sectionsSrvc.getSectionAt(sectionId),
                    referenceCount = selectedSection.referenceCount,
                    hasQuestions = (!Array.isArray(selectedSection.questionIds) || !selectedSection.questionIds.length) ? 'This section has no associated questions.' : 'Questions will be kept.';

                $ionicActionSheet.show({
                    titleText: 'Modify \'' + selectedSection.heading + '\'',
                    cancelText: 'Cancel',
                    buttons: [{
                        text: 'Edit survey details'
                    }],
                    destructiveText: 'Delete',
                    destructiveButtonClicked: function () {
                        if ((isGlobal) && referenceCount > 0) {
                            $ionicPopup.alert({
                                title: 'Can\'t delete section, referenceCount is ' + referenceCount,
                                template: 'Sections from the global list can only be deleted if referenceCount is 0.'
                            });
                            return true; // Close action menu
                        } else if ((isGlobal) && (referenceCount === 0 || referenceCount === null)) { // global delete
                            $ionicPopup.confirm({
                                title: 'Delete Section',
                                template: 'Are you sure you want to delete section \'' + selectedSection.heading + '\'?'
                            }).then(function (response) {
                                if (response) {
                                    vm.sections.splice(vm.sections.findIndex(function (section) {
                                        return section.id === selectedSection.id;
                                    }), 1); // Splice from the viewmodel
                                    sectionsSrvc.deleteSection(selectedSection.id);
                                    console.log('DELETED section object');
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                            return true; // Close action menu
                        } else if (referenceCount > 1) { // too many references to delete
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
                                if (response === 0 || response === 1) {
                                    vm.sections.splice(vm.sections.findIndex(function (section) {
                                        return section.id === selectedSection.id;
                                    }), 1); // Splice from the viewmodel
                                    vm.parentSurvey.sectionIds.splice(vm.parentSurvey.sectionIds.indexOf(selectedSection.id), 1); // Remove this section from section list
                                    surveysSrvc.updateSurvey(vm.parentSurvey);

                                    if (response === 1) { // If response is one, i.e user selected 'Delete Section'
                                        if (hasQuestions) {
                                            questionsSrvc.dereferenceQuestions(selectedSection.questionIds); // Decrement the reference count of each question in the section
                                        }
                                        sectionsSrvc.deleteSection(selectedSection.id); // Delete section from API
                                    }
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                            return true;
                        }
                    },
                    buttonClicked: function (buttonIndex) {
                        if (buttonIndex === 0) {
                            vm.selectDetail(selectedSection.id);
                        }
                        return true; // Close action menu
                    }
                });
            }
        });
    }
}());
