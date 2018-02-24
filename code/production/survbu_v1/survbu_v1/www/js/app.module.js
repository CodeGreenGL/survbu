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
                    controller: 'surveysListCtrl as vm',
                    resolve: {
                        paramPromise: function (surveysSrvc) {
                            surveysSrvc.isWaiting(true);
                            return surveysSrvc.updateAllSurveys().then(function () {
                                surveysSrvc.isWaiting(false);
                            });
                        }
                    }
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
                .state('surveys_add', {
                    cache: false,
                    url: '/surveys_add',
                    templateUrl: 'js/app_specific/surveys/surveys.add.html',
                    params: {
                        'selected': 0
                    },
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
                    controller: 'sectionsListCtrl as vm',
                    resolve: {
                        paramPromise: function (sectionsSrvc, $stateParams) {
                            sectionsSrvc.isWaiting(true);
                            if ($stateParams.parentSurvey === 0) {
                                return sectionsSrvc.getAllSections().then(function () {
                                    sectionsSrvc.isWaiting(false);
                                });
                            } else {
                                sectionsSrvc.isWaiting(false);
                            }
                        }
                    }
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
                        'parentSectionSurvey': 0
                    },
                    controller: 'questionsListCtrl as vm',
                    resolve: {
                        paramPromise: function (questionsSrvc, $stateParams) {
                            questionsSrvc.isWaiting(true);
                            if ($stateParams.parentSection === 0) {
                                return questionsSrvc.getAllQuestions().then(function () {
                                    questionsSrvc.isWaiting(false);
                                });
                            } else {
                                questionsSrvc.isWaiting(false);
                            }
                        }
                    }
                })
                .state('questions_detail', {
                    cache: false,
                    url: '/questions_detail',
                    templateUrl: 'js/app_specific/questions/questions.detail.html',
                    params: {
                        'selected': 0
                    },
                    controller: 'questionsDetailCtrl as vm'
                })
                .state('questions_add', {
                    cache: false,
                    url: '/questions_add',
                    templateUrl: 'js/app_specific/questions/questions.add.html',
                    params: {
                        'parentSection': 0,
                        'parentSectionSurvey': 0
                    },
                    controller: 'questionsAddCtrl as vm'
                })
                .state('questions_addfe', {
                    cache: false,
                    url: '/questions_addfe',
                    templateUrl: 'js/app_specific/questions/questions.addfe.html',
                    controller: 'questionsAddfeCtrl as vm'
                });
        });
}());
