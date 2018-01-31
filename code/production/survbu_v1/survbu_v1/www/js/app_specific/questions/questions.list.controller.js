(function () {
    'use strict';

    angular
        .module('questionsjs')
        .controller('questionsListCtrl', control);

    control.$inject = [
        '$state',
        'questionsSrvc'
        ];
    
    function control(
        $state,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            questions : []
         });
        
        vm.onItemSelected = function(index){

            // we're passing parameters into the new state
            // 'selected is an attribute in a parameter object, defined in the module definition
            // I'm going to write the destination controller, so it knows to look for an object with a 'selected' attribute
            $state.go('questions_detail', {selected: index});
        }

        vm.noQuestions = function(){
            return vm.questions.length == 0;
        }

        vm.update = function(){
            $state.go('questions_update');
        }


        vm.questions = questionsSrvc.getQuestions();
              
    }
})();
