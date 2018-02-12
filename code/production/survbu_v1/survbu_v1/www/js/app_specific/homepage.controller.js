/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('homepageCtrl', control);

    control.$inject = [
        '$state',
        'surveysSrvc'
    ];

    function control(
        $state,
        surveysSrvc
    ) {
        
        var vm = angular.extend(this, {
            listSurveys: function () {
                surveysSrvc.isWaiting(true);
                $state.go('surveys_list');
                
                surveysSrvc.updateSurveys().then(function () {
                    surveysSrvc.isWaiting(false);
                    
                    if (surveysSrvc.getSurveys().length > 0) {
                        $state.reload();
                    }
                });
            } //end listSurveys function
        }); //end angular.extend
    } //end function control (controller)
}());