(function() {
	'use strict';

	angular
		.module('surveysjs', [])

        .config(function($stateProvider) {
			$stateProvider
				.state('surveys_list', {
					cache: false,
					url: '/surveys_list',
					templateUrl: 'js/app_specific/surveys/surveys.list.html',
                    controller: 'surveysListCtrl as vm'
                })
                .state('surveys_update', {
					cache: false,
					url: '/surveys_update',
					templateUrl: 'js/app_specific/surveys/surveys.update.html',
                    controller: 'surveysUpdateCtrl as vm'
                })
                .state('surveys_detail', {
					cache: false,
					url: '/surveys_detail',
                    templateUrl: 'js/app_specific/surveys/surveys.detail.html',
                    params: {'selected': 0 },
                    controller: 'surveysDetailCtrl as vm'
                })

            });
				
})();
