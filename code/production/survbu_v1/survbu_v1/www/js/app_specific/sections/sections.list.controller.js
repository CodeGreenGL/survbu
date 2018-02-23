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
        var vm = angular.extend(this, {
            parentSurvey: $stateParams.parentSurvey,
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

                questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                    if(sectionQuestions.length > 0){
                        $state.reload();
                    }     
                    questionsSrvc.isWaiting(false);
                });
            },
            showActionMenu: function ($event, section) {
                $event.stopPropagation();

                var selectedSection = section,
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
                            console.log("surveysSrvc getNumSurveys is :");
                            console.log(surveysSrvc.getNumSurveys());
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
                                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function (){
                                        surveysSrvc.updateAllSurveys();
                                    });
                                    sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                        $state.reload();
                                    });
                                } else if (response === 1) {
                                    console.log(vm.parentSurvey.sectionIds);
                                    vm.parentSurvey.sectionIds.splice(vm.parentSurvey.sectionIds.indexOf(selectedSection.id), 1);
                                    console.log(vm.parentSurvey.sectionIds);

                                    sectionsSrvc.deleteSection(selectedSection.id);
                                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function (){
                                        surveysSrvc.updateAllSurveys();
                                    });
                                    //below may need moving above above embedded promises
                                    sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function () {
                                        $state.reload();
                                    });
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
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
