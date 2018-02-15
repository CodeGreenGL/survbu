/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
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
            selectDetail: function ($event, index) {
                $event.stopPropagation();
                $state.go('surveys_detail', {
                    selected: index
                });
            },
            listSections: function (index) { //take you to the sections list and updates the list
                sectionsSrvc.isWaiting(true);
                $state.go('sections_list');

                surveysSrvc.setCurrentSurvey(index);
                var selectedSurvey = surveysSrvc.getSurveyAt(index),
                    surveySections = selectedSurvey.sectionIds;

                if (surveySections.length > 0) {
                    sectionsSrvc.updateSections(surveySections).then(function () {
                        $state.reload();
                        sectionsSrvc.isWaiting(false);
                    });
                } else {
                    sectionsSrvc.disposeSections();
                    sectionsSrvc.isWaiting(false);
                }
            },
            showDeleteAlert: function ($event, index) {
                $event.stopPropagation();
                var selectedSurvey = surveysSrvc.getSurveyAt(index);
                $ionicPopup.confirm({
                    title: 'Delete Survey',
                    template: 'Are you sure you want to delete \'' + selectedSurvey.introductionMessage + '\'?'
                }).then(function (response) {
                    if (response) {
                        console.log('User confirmed action');
                    } else {
                        console.log('User pressed cancel');
                    }
                });
            }
        });
    }
}());
