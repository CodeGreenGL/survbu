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
            sections : [],
            stillWaits : sectionsSrvc.isItWaiting()
         });
        
        vm.onItemSelected = function($event,index){
            $event.stopPropagation();
            $state.go('sections_detail', {selected: index}); // NEEDS TO BE CHANGED TO THE APPOPRIATE STATE !!!
        }

        vm.noSections = function(){
            return vm.sections.length == 0;
        }

        vm.update = function(){
            $state.go('sections_list');
        }

        //take you to the questions list and updates the list
        vm.listQuestions = function(){
            questionsSrvc.isWaiting(true);
            $state.go('questions_list');
            questionsSrvc.updateQuestions().then(function(){
                $state.reload();
                questionsSrvc.isWaiting(false);
            });    
        }

//        vm.editSection = function($event){
//            $event.stopPropagation();
//            $state.go('sections_edit');
//        }

//        vm.backToSurveysButton = function(){ //NEEDS REMOVING
//            $state.go('surveys_update');
//        };

        vm.stillWaiting = function(){
            return vm.stillWaits;
        }

        vm.sections = sectionsSrvc.getSections();
        
        vm.hideSList = function() {
            return (vm.stillWaiting() || vm.noSections());
        }

        vm.hideNoItems = function() {
            return (vm.stillWaiting() || !vm.noSections());
        }

    }
})();
