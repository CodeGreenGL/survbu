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

        });
		
		vm.listSurveys = function () {
			surveysSrvc.isWaiting(true);
			$state.go('surveys_list');
			
			surveysSrvc.updateSurveys().then(function () {
				surveysSrvc.isWaiting(false);
				$state.reload();
			});
		}
    }
}());
