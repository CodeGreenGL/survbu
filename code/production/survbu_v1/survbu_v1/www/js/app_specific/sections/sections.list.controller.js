/*global angular */
(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control($state,
        sectionsSrvc,
        questionsSrvc
        ) {
        var vm = angular.extend(this, {
            sections: [],
            stillWaits: sectionsSrvc.isItWaiting()
        });

        vm.onItemSelected = function ($event, index) {
            $event.stopPropagation();
            $state.go('sections_detail', {
                selected: index
            }); // NEEDS TO BE CHANGED TO THE APPOPRIATE STATE !!!
        };

        //take you to the questions list and updates the list
        vm.listQuestions = function () {
            questionsSrvc.isWaiting(true);
            $state.go('questions_list');
            questionsSrvc.updateQuestions().then(function () {
                $state.reload();
                questionsSrvc.isWaiting(false);
            });
        };

        //        vm.editSection = function($event){
        //            $event.stopPropagation();
        //            $state.go('sections_edit');
        //        }

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

        vm.sections = sectionsSrvc.getSections();

    }
}());
