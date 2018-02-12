/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            sections: sectionsSrvc.getSections(),
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
                $state.go('sections_add');
            },
            selectDetail: function ($event, index) {
                $event.stopPropagation();
                $state.go('sections_detail', {
                    selected: index
                });
            },
            listQuestions: function (index) {
                questionsSrvc.isWaiting(true);
                $state.go('questions_list');

                var selectedSection = sectionsSrvc.getSectionAt(index),
                    sectionQuestions = selectedSection.questionIds;
            
                if (sectionQuestions.length > 0) {
                    questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                        $state.reload();
                        questionsSrvc.isWaiting(false);
                    });
                } else {
                    questionsSrvc.isWaiting(false);
                }
            }
        });
    }
}());
