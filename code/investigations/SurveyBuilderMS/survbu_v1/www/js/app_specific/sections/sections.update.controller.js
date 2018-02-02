(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .controller('sectionsUpdateCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc'
        ];
    
    function control(
        $state,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            
         });
        

      
      
        // TODO: Error Handling
        sectionsSrvc.updateSections().then(function(){
            $state.go('sections_list');
        });    
    }
})();
