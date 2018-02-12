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
        angular.extend(this, {
            section: sectionsSrvc.getSectionAt($stateParams.selected),
            submitButton: function () {
                $state.go('sections_list');
            }
        });
    }
}());
