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
        var vm = angular.extend(this, {
            section : {
                heading: "no text",
                introductionMessage: "no type"
            }
         });
        

        vm.updateSection = function(){
            $state.go('sections_list');
        }

        var params = $stateParams;

        vm.section = sectionsSrvc.getSectionAt(params.selected);

    }
})();
