/*global angular */
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
        var parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
            parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
            sections: sectionsSrvc.returnSections(),
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
            addSection: function addSection() {
                $state.go('sections_add', {
                    parentSurveyId: vm.parentSurvey.id
                });
            },
            selectDetail: function (sectionId) {
                $state.go('sections_detail', {
                    parentSurveyId: vm.parentSurvey.id,
                    sectionId: section.id
                });
            },
            listQuestions: function (sectionId) {
                questionsSrvc.isWaiting(true);

               /* var selectedSection = sectionsSrvc.getSectionAt(index),
                    sectionQuestions = selectedSection.questionIds;*/
                var section = sectionsSrvc.getSectionAt(sectionId), //could be possible deleted
                    sectionQuestions = section.questionIds;
                

                $state.go('questions_list', {
                    parentSectionId: section.id,
                    parentSurveyId: vm.parentSurvey.id
                });

               // sectionsSrvc.setCurrentSection(index); // needs to be removed with implementation of $stateParams

                questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                    if(sectionQuestions.length > 0){
                        $state.reload();
                    }     
                    questionsSrvc.isWaiting(false);
                });
            },
            showActionMenu: function ($event, sectionId) {
                $event.stopPropagation();

                var selectedSection = sectionsSrvc.getSectionAt(sectionId),
                    hasQuestions = (!Array.isArray(selectedSection.questionIds) || !selectedSection.questionIds.length) ? 'This section has no associated questions.' : 'Questions will be kept.'; //TRUE=empty array
                $ionicActionSheet.show({
                    titleText: 'Modify \'' + selectedSection.heading + '\'',
                    cancelText: 'Cancel',
                    buttons: [{
                        text: 'Edit survey details'
                    }],
                    destructiveText: 'Delete',
                    destructiveButtonClicked: function () {
                        if (surveysSrvc.getNumSurveys() === 0) {
                            $ionicPopup.alert({
                                title: 'Can\'t delete section from global list!',
                                template: 'Sections can only be deleted via the relevant survey.'
                            });
                        } else {
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
                                    vm.parentSurvey.sectionIds.splice(vm.parentSurvey.sectionIds.indexOf(selectedSection.id), 1);
                                    sectionsSrvc.updateSections(vm.parentSurvey.sectionIds)
                                    .then(function (response) {
                                        surveysSrvc.updateSurvey(vm.parentSurvey)
                                        .then(function (response) {
                                            surveysSrvc.updateAllSurveys()
                                            .then(function (response) {
                                                $state.reload();
                                            });
                                        });
                                    });
                                } else if (response === 1) {
                                    vm.parentSurvey.sectionIds.splice(vm.parentSurvey.sectionIds.indexOf(selectedSection.id), 1);
                                    sectionsSrvc.deleteSection(selectedSection.id)
                                    .then(function (response) {
                                        sectionsSrvc.updateSections(vm.parentSurvey.sectionIds)
                                        .then(function (response) {
                                            surveysSrvc.updateSurvey(vm.parentSurvey)
                                            .then(function (response) {
                                                surveysSrvc.updateAllSurveys()
                                                .then(function (response) {
                                                    $state.reload();
                                                });
                                            });
                                        });
                                    });
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
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
