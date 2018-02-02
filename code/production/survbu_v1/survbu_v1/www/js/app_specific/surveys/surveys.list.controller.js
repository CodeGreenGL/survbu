(function () {
    'use strict';

    angular
        .module('surveysjs')
        .controller('surveysListCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc'
        ];
    
    function control(
        $state,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {
            surveys : []
         });
        
        vm.onItemSelected = function(index){

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('surveys_detail', {selected: index}); // NEEDS TO BE CHANGED TO THE APPOPRIATE STATE !!!
        }

        vm.nosurveys = function(){
            return vm.surveys.length == 0;
        }

        vm.update = function(){
            $state.go('surveys_update');
        }

        vm.surveys = surveysSrvc.getsurveys();
              
    }
})();
