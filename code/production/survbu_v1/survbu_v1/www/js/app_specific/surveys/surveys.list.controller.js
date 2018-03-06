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
        surveysSrvc.isWaiting(true);
        surveysSrvc.updateAllSurveys().then(responseSurveysArray => {
            vm.surveys = responseSurveysArray;
            surveysSrvc.isWaiting(false);
        });
        var vm = angular.extend(this, {
            surveys: surveysSrvc.getSurveys(),
            stillWaiting: function () {
                return surveysSrvc.isItWaiting();
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
            selectDetail: function (surveyId) {
                $state.go('surveys_detail', {
                    surveyId: surveyId
                });
            },
            addSurvey: function () { //no need to pass params since we have the values already avaliable in survey.add.controller
                $state.go('surveys_add');
            },
            showActionMenu: function ($event, surveyId) { //this was index
                $event.stopPropagation();
                var selectedSurvey = surveysSrvc.getSurveyAt(surveyId);

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
                                    vm.surveys.splice(vm.surveys.indexOf(selectedSurvey), 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                            return true;
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
                                    vm.surveys.splice(vm.surveys.indexOf(selectedSurvey), 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                    sectionsSrvc.dereferenceSections(selectedSurvey.sectionIds); // Dereference the sections if they are being kept
                                    console.log('Deleted Survey, KEPT associated sections');
                                } else if (response === 1) {
                                    for (var i = 0; i < selectedSurvey.sectionIds.length; i++) {
                                        sectionsSrvc.deleteSection(selectedSurvey.sectionIds[i]);
                                    }
                                    vm.surveys.splice(vm.surveys.indexOf(selectedSurvey), 1);
                                    surveysSrvc.deleteSurvey(selectedSurvey.id);
                                    console.log('Deleted Survey, DELETED associated sections');
                                } else {
                                    console.log('User pressed cancel');
                                }
                            });
                            return true;
                        }
                    },
                    buttonClicked: function (buttonIndex) {
                        if (buttonIndex === 0) {
                            vm.selectDetail(selectedSurvey.id);
                        }
                        return true; // Close action menu
                    }
                });
            }
        });
    }
}());
