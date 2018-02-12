/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule', [])
        .config(function ($stateProvider, $locationProvider) {
			
            // use the HTML5 History API
            //$locationProvider.html5Mode(true);
            $stateProvider
			
				// HOMEPAGE
                .state('homepage', {
                    cache: false,
                    url: '/',
                    templateUrl: 'js/app_specific/homepage.html',
                    controller: 'homepageCtrl as vm'
                })
				
				// SURVEYS
                .state('surveys_list', {
                    cache: false,
                    url: '/surveys_list',
                    templateUrl: 'js/app_specific/surveys/surveys.list.html',
                    controller: 'surveysListCtrl as vm'
                })
                .state('surveys_detail', {
                    cache: false,
                    url: '/surveys_detail',
                    templateUrl: 'js/app_specific/surveys/surveys.detail.html',
                    params: {
                        'selected': 0
                    },
                    controller: 'surveysDetailCtrl as vm'
                })
				
				// SECTIONS
				.state('sections_list', {
                    cache: false,
                    url: '/sections_list',
                    templateUrl: 'js/app_specific/sections/sections.list.html',
                    controller: 'sectionsListCtrl as vm'
                })
                .state('sections_detail', {
                    cache: false,
                    url: '/sections_detail',
                    templateUrl: 'js/app_specific/sections/sections.detail.html',
                    params: {
                        'selected': 0
                    },
                    controller: 'sectionsDetailCtrl as vm'
                })
				
				// QUESTIONS
				.state('questions_list', {
                    cache: false,
                    url: '/questions_list',
                    templateUrl: 'js/app_specific/questions/questions.list.html',
                    controller: 'questionsListCtrl as vm'
                })
                .state('questions_detail', {
                    cache: false,
                    url: '/questions_detail',
                    templateUrl: 'js/app_specific/questions/questions.detail.html',
                    params: {
                        'selected': 0
                    },
                    controller: 'questionsDetailCtrl as vm'
                });
        });
}());
