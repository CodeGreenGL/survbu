(function () {
    'use strict';

    angular
        .module('sectionsjs')
        .controller('sectionsListCtrl', control);

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
        
        vm.onItemSelected = function(index){

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('sections_detail', {selected: index}); // NEEDS TO BE CHANGED TO THE APPOPRIATE STATE !!!
        }

        vm.noSections = function(){
            return vm.sections.length == 0;
        }

        vm.update = function(){
            $state.go('sections_update');
        }

        vm.listQuestions = function(){
            console.log("WORKS");
            $state.go('questions_list')
        }

        vm.sections = sectionsSrvc.getSections();
              
    }
})();
