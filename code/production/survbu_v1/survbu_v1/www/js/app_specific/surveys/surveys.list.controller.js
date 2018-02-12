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

                var selectedSurvey = surveysSrvc.getSurveyAt(index),
                    surveySections = selectedSurvey.sectionIds;
                
                if (surveySections.length > 0) {
                    sectionsSrvc.updateSections(surveySections).then(function () {
                        $state.reload();
                        sectionsSrvc.isWaiting(false);
                    });
                } else {
                    sectionsSrvc.isWaiting(false);
                }
            }
        });
    }
}());
