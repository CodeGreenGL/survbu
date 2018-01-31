(function () {
    'use strict';

    angular
        .module('questionsjs')
        .controller('questionsUpdateCtrl', control);

    control.$inject = [
        '$state',
        'questionsSrvc'
        ];
    
    function control(
        $state,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            
         });
        

      

        // TODO: Error Handling
        questionsSrvc.updateQuestions().then(function(){
            $state.go('questions_list');
        });    
    }
})();
