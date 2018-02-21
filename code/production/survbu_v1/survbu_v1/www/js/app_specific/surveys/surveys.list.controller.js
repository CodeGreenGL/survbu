/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicActionSheet',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $ionicActionSheet,
        $ionicPopup,
        surveysSrvc,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            surveys: surveysSrvc.getSurveys(),
            stillWaits: surveysSrvc.isItWaiting(),
            stillWaiting: function () {
                return vm.stillWaits;
            },
            noContent: function () {
                return vm.surveys.length === 0;
            },
            hideList: function () {
                return (vm.stillWaiting() || vm.noContent());
            },
            hideNoItems: function () {
                return (vm.stillWaiting() || !vm.noContent());
            },
            selectDetail: function (index) {
                $state.go('surveys_detail', {
                    selected: index
                });
            },
            addSurvey: function () {
                $state.go('surveys_add', {
                    // PARAMS HERE
                });
            },
            listSections: function (index) { //take you to the sections list and updates the list
                sectionsSrvc.isWaiting(true);
                
                var selectedSurvey = surveysSrvc.getSurveyAt(index),
                    surveySections = selectedSurvey.sectionIds;
                
                $state.go('sections_list', {
                    parentSurvey: selectedSurvey
                });

                surveysSrvc.setCurrentSurvey(index); // needs to be removed with implementation of $stateParams

                sectionsSrvc.updateSections(surveySections).then(function () {
                    if (surveySections.length > 0) {
                        $state.reload();
                    }
                    sectionsSrvc.isWaiting(false);
                });

            },
            showActionMenu: function ($event, index) {
                $event.stopPropagation();
                var selectedSurvey = surveysSrvc.getSurveyAt(index);

                $ionicActionSheet.show({
                    titleText: 'Modify \'' + selectedSurvey.introductionMessage + '\'',
                    cancelText: 'Cancel',
                    buttons: [{
                        text: 'Edit survey details'
                    }],
                    destructiveText: 'Delete',
                    destructiveButtonClicked: function () {
                        if (!Array.isArray(selectedSurvey.sectionIds) || !selectedSurvey.sectionIds.length) {
                            $ionicPopup.confirm({
                                title: 'Delete \'' + selectedSurvey.introductionMessage + '\'',
                                cssClass: 'extendedDeletePopup',
                                template: 'Are you sure you want to permanently delete this survey?<br/><br/>This survey has no associated sections.'
                            }).then(function (response) {
                                if (response) {
                                    vm.surveys.splice(index, 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                        } else {
                            $ionicPopup.show({
                                title: 'Delete \'' + selectedSurvey.introductionMessage + '\'',
                                cssClass: 'extendedDeletePopup',
                                template: 'Would you like to keep, or delete the sections associated with this survey?<br/><br/>Questions will be kept.',
                                buttons: [{
                                    text: 'Cancel',
                                    type: 'button-light'
                                }, {
                                    text: 'Keep Sections',
                                    type: 'button-calm',
                                    onTap: function () {
                                        return 0;
                                    }
                                }, {
                                    text: 'Delete Sections',
                                    type: 'button-assertive',
                                    onTap: function () {
                                        return 1;
                                    }
                                }]
                            }).then(function (response) {
                                if (response === 0) {
                                    vm.surveys.splice(index, 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                    console.log('Deleted Survey, KEPT associated sections');
                                } else if (response === 1) {
                                    for (var i = 0; i < selectedSurvey.sectionIds.length; i++) {
                                        sectionsSrvc.deleteSection(selectedSurvey.sectionIds[i]);
                                    }
                                    vm.surveys.splice(index, 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                    console.log('Deleted Survey, DELETED associated sections');
                                } else {
                                    console.log('User pressed cancel');
                                }
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
