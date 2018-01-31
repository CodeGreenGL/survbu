(function () {
    'use strict';

    angular
        .module('questionsjs')
        .controller('questionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'questionsSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            question : {
                questionText: "no text",
                questionType: "no type"
            }
         });
        

        vm.done = function(){
            $state.go('questions_list');
        }

        var params = $stateParams;

        vm.question = questionsSrvc.getQuestionAt(params.selected);

    }
})();
