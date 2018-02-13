/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc',
        'questionsSrvc',
        '$stateParams'
    ];

    function control(
        $state,
        sectionsSrvc,
        questionsSrvc,
        $stateParams
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                parentSurvey : params.parentSurvey,
                sections: [],
                stillWaits: sectionsSrvc.isItWaiting()
            });

        vm.selectDetail = function ($event, index) {
            $event.stopPropagation();
            $state.go('sections_detail', {
                selected: index
            });
        };

        //take you to the questions list and updates the list
        vm.listQuestions = function (index) {
            questionsSrvc.isWaiting(true);
            var selectedSection = sectionsSrvc.getSectionAt(index);

            $state.go('questions_list', {
                parentSection: selectedSection,
                parentSectionSurvey: vm.parentSurvey
            });

            
            var sectionQuestions = selectedSection['questionIds'];

            questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                if (sectionQuestions.length > 0) {
                    $state.reload();
                };
                questionsSrvc.isWaiting(false);
            });
        };

        vm.update = function () {
            $state.go('sections_list');
        };

        vm.stillWaiting = function () {
            return vm.stillWaits;
        };

        vm.noContent = function () {
            return vm.sections.length === 0;
        };

        vm.hideList = function () {
            return (vm.stillWaiting() || vm.noContent());
        };

        vm.hideNoItems = function () {
            return (vm.stillWaiting() || !vm.noContent());
        };

        vm.addSection = function (){
            $state.go('sections_add', {
                parentSurvey: vm.parentSurvey
                });
        };

        vm.sections = sectionsSrvc.getSections();

    }
}());
