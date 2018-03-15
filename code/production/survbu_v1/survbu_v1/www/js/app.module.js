/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule', [])
        .run(function ($http) { // Sets default http headers for all requests
            $http.defaults.headers.common = {
                Authorization: "Basic OTQwZjRjNDctOWJjMS00N2E5LTgxZWQtMWNmMmViNDljOGRlOjBmYTIwMjYzLTVmOTYtNDZiMi05YjUxLWVlOTZkMzczYTVmZQ==",
                Accept: "application/json",
                'Content-Type': "application/json"
            };
        })
        .config(function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise("/");

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
                        'surveyId': 0
                    },
                    controller: 'surveysDetailCtrl as vm'
                })
                .state('surveys_add', {
                    cache: false,
                    url: '/surveys_add',
                    templateUrl: 'js/app_specific/surveys/surveys.add.html',
                    controller: 'surveysAddCtrl as vm'
                })

				// SECTIONS
				.state('sections_list', {
                    cache: false,
                    url: '/sections_list',
                    templateUrl: 'js/app_specific/sections/sections.list.html',
                    params: {
                        'surveyId': 0
                    },
                    controller: 'sectionsListCtrl as vm'
                })
                .state('sections_detail', {
                    cache: false,
                    url: '/sections_detail',
                    templateUrl: 'js/app_specific/sections/sections.detail.html',
                    params: {
                        'sectionId': 0,
                        'surveyId': 0
                    },
                    controller: 'sectionsDetailCtrl as vm'
                })
                .state('sections_add', {
                    cache: false,
                    url: '/sections_add',
                    templateUrl: 'js/app_specific/sections/sections.add.html',
                    params: {
                        'surveyId': 0
                    },
                    controller: 'sectionsAddCtrl as vm'
                })
                .state('sections_addfe', {
                    cache: false,
                    url: '/sections_addfe',
                    templateUrl: 'js/app_specific/sections/sections.addfe.html',
                    params: {
                        'surveyId': 0
                    },
                    controller: 'sectionsAddfeCtrl as vm'
                })

				// QUESTIONS
				.state('questions_list', {
                    cache: false,
                    url: '/questions_list',
                    templateUrl: 'js/app_specific/questions/questions.list.html',
                    params: {
                        'sectionId': 0,
                        'surveyId': 0
                    },
                    controller: 'questionsListCtrl as vm'
                })
                .state('questions_detail', {
                    cache: false,
                    url: '/questions_detail',
                    templateUrl: 'js/app_specific/questions/questions.detail.html',
                    params: {
                        'questionId': 0,
                        'sectionId': 0,
                        'surveyId': 0
                    },
                    controller: 'questionsDetailCtrl as vm'
                })
                .state('questions_add', {
                    cache: false,
                    url: '/questions_add',
                    templateUrl: 'js/app_specific/questions/questions.add.html',
                    params: {
                        'sectionId': 0,
                        'surveyId': 0
                    },
                    controller: 'questionsAddCtrl as vm'
                })
				.state('questions_addfe', {
                    cache: false,
                    url: '/questions_addfe',
                    templateUrl: 'js/app_specific/questions/questions.addfe.html',
                    params: {
                        'sectionId': 0,
                        'surveyId': 0
                    },
                    controller: 'questionsAddfeCtrl as vm'
                });
        });
}());
