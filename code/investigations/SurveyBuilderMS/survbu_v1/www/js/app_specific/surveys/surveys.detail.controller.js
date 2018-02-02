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
            section : {
                sectionText: "no text",
                sectionType: "no type"
            }
         });
        

        vm.done = function(){
            $state.go('surveys_list');
        }

        var params = $stateParams;

        vm.section = surveysSrvc.getSectionAt(params.selected);

    }
})();
