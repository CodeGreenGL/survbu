/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule', [])
        .config(function ($stateProvider) {
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
                        'survey': 0
                    },
                    controller: 'surveysDetailCtrl as vm'
                })
                .state('surveys_add', {
                    cache: false,
                    url: '/surveys_add',
                    templateUrl: 'js/app_specific/surveys/surveys.add.html',
                   /* params: {
                        'selected': 0
                    },*/
                    controller: 'surveysAddCtrl as vm'
                })
				
				// SECTIONS
				.state('sections_list', {
                    cache: false,
                    url: '/sections_list',
                    templateUrl: 'js/app_specific/sections/sections.list.html',
                    params: {
                        'parentSurvey': 0
                    },
                    controller: 'sectionsListCtrl as vm'
                })
                .state('sections_detail', {
                    cache: false,
                    url: '/sections_detail',
                    templateUrl: 'js/app_specific/sections/sections.detail.html',
                    params: {
                        'section': 0
                    },
                    controller: 'sectionsDetailCtrl as vm'
                })
                .state('sections_add', {
                    cache: false,
                    url: '/sections_add',
                    templateUrl: 'js/app_specific/sections/sections.add.html',
                    params: {
                        'parentSurvey': 0
                    },
                    controller: 'sectionsAddCtrl as vm'
                })
				
				// QUESTIONS
				.state('questions_list', {
                    cache: false,
                    url: '/questions_list',
                    templateUrl: 'js/app_specific/questions/questions.list.html',
                    params: {
                        'parentSection': 0,
                        'parentSurvey': 0
                    },
                    controller: 'questionsListCtrl as vm'
                })
                .state('questions_detail', {
                    cache: false,
                    url: '/questions_detail',
                    templateUrl: 'js/app_specific/questions/questions.detail.html',
                    params: {
                        'question': 0
                    },
                    controller: 'questionsDetailCtrl as vm'
                })
                .state('questions_add', {
                    cache: false,
                    url: '/questions_add',
                    templateUrl: 'js/app_specific/questions/questions.add.html',
                    params: {
                        'parentSection': 0,
                        'parentSurvey': 0
                    },
                    controller: 'questionsAddCtrl as vm'
                })
				.state('questions_addfe', {
                    cache: false,
                    url: '/questions_addfe',
                    templateUrl: 'js/app_specific/questions/questions.addfe.html',
                    params: {
                        'parentSection': 0,
                        'parentSurvey': 0
                    },
                    controller: 'questionsAddfeCtrl as vm'
                });
        });
}());
