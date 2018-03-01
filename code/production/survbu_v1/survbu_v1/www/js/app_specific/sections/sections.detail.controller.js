/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        'sectionsSrvc'
    ];

    function control(
        $state,
        sectionsSrvc
    ) {
        var vm = angular.extend(this, {
            section: sectionsSrvc.getSectionAt($state.params.sectionId),
            submitButton: function () {
                $state.go('sections_list');
            }
        });
    }
}());
