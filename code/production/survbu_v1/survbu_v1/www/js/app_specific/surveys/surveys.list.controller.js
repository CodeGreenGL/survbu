/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('surveysListCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc',
        'sectionsSrvc'
    ];

    function control(
        $state,
        surveysSrvc,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            surveys: [],
            stillWaits: surveysSrvc.isItWaiting()
        });

        vm.selectDetail = function ($event, index) {
            $event.stopPropagation();
            $state.go('surveys_detail', {
                selected: index
            });
        };
        
        //take you to the sections list and updates the list
        vm.listSections = function (index) {
            sectionsSrvc.isWaiting(true);
            $state.go('sections_list');

            var selectedSurvey = surveysSrvc.getSectionAt(index),
                surveySections = selectedSurvey.sectionIds;
            
            sectionsSrvc.updateSections(surveySections).then(function () {
				sectionsSrvc.isWaiting(false);
                if (surveySections.length > 0) {
                    $state.reload();
                }
            });
        };
            
        vm.update = function () {
            $state.go('surveys_update');
        };

        vm.stillWaiting = function () {
            return vm.stillWaits;
        };

        vm.noContent = function () {
            return vm.surveys.length === 0;
        };

        vm.hideList = function () {
            return (vm.stillWaiting() || vm.noContent());
        };

        vm.hideNoItems = function () {
            return (vm.stillWaiting() || !vm.noContent());
        };

        vm.surveys = surveysSrvc.getSurveys();

    }
}());
