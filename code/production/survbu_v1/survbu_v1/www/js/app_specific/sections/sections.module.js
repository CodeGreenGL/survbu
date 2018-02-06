/*global angular */
(function () {
    'use strict';

    angular
        .module('sectionsjs', [])

        .config(function ($stateProvider, $locationProvider) {
            // use the HTML5 History API
            $locationProvider.html5Mode(true);
            $stateProvider
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
                });
        });
}());
