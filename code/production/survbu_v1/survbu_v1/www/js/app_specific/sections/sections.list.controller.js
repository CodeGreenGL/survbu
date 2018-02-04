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
    
    function control(
        $state,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            sections : []
         });
        
        vm.onItemSelected = function(index){
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
            questionsSrvc.isWaiting(true);
            $state.go('questions_list');
            console.log("does it log the previous list?");
            questionsSrvc.updateQuestions().then(function(){
                $state.reload();
                questionsSrvc.isWaiting(false);
            });    
        }

        vm.editSection = function($event){
            $event.stopPropagation();
            $state.go('sections_edit');
        }

        vm.backToSurveysButton = function(){ //NEEDS REMOVING
            $state.go('surveys_update');
        };

        vm.sections = sectionsSrvc.getSections();
              
    }
})();
