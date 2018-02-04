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

        //take you to the questions list and updates the list
        vm.listQuestions = function(){
            $state.go('questions_update');
        }
    //add $event to the function as param - this should prevent double clikcing on ng-click (I found it still now working.)
        vm.editSection = function($event){
            console.log("WORKS EDIT");
            $event.stopPropagation();
            $state.go('sections_edit');
        }

        vm.backToSurveysButton = function(){
            $state.go('surveys_update');
        };

        vm.sections = sectionsSrvc.getSections();
              
    }
})();
