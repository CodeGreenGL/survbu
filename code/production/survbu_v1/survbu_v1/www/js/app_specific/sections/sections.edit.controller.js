(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .controller('sectionsEditCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc'
        ];
    
    function control(
        $state,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            sections : []
         });
        
        vm.update = function(){
            $state.go('sections_list');
        }     
    }
})();