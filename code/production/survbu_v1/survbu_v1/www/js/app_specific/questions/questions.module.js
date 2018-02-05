/*global angular */
(function () {
    'use strict';

    angular
        .module('questionsjs', [])

        .config(function ($stateProvider) {
            $stateProvider
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
