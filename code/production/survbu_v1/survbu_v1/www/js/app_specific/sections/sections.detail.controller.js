/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            section: $stateParams.section,
            submitButton: function () {
                $state.go('sections_list');
            }
        });
    }
}());
