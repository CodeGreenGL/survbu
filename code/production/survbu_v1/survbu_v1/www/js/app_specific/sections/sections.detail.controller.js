/*global angular */
(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc
    ) {
        var params = $stateParams,
            vm = angular.extend(this, {
                section: {
                    heading: "no text",
                    introductionMessage: "no type"
                }
            });
            
        vm.updateSection = function () {
            $state.go('sections_list');
        };

        vm.section = sectionsSrvc.getSectionAt(params.selected);
            
    }
}());