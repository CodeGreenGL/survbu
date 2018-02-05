(function () {
    'use strict';

    angular
        .module('surveysjs')
        .controller('surveysDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'surveysSrvc'
        ];
    
    function control(
        $state,
        $stateParams,
        surveysSrvc
    ) {
        var vm = angular.extend(this, {
            survey : {
                introductionMessage: "no text",
                completionMessage: "no type"
            }
         });
        

        vm.done = function(){
            $state.go('surveys_list');
        }

        var params = $stateParams;

        vm.survey = surveysSrvc.getSectionAt(params.selected);

    }
})();
