/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsAddfeCtrl', control);

    control.$inject = [
        '$scope',
        '$state',
        '$stateParams',
        'surveysSrvc',
        'sectionsSrvc',
    ];

    function control(
        $scope,
        $state,
        $stateParams,
        surveysSrvc,
        sectionsSrvc,
    ) {
      	var parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
                parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
                sections: sectionsSrvc.getRemainingSections(),

                stillWaits: sectionsSrvc.isItWaiting(),
                stillWaiting: function () {
                    return vm.stillWaits;
                },
                noContent: function () {
                    return vm.sections.length === 0;
                },
                hideList: function () {
                    return (vm.stillWaiting() || vm.noContent());
                },
                hideNoItems: function () {
                    return (vm.stillWaiting() || !vm.noContent());
                },
                addSections: function () {
                console.log(vm.parentSurvey);
                    for (var i = 0; i < vm.sections.length; i++) {
                        if (vm.sections[i].adding === true) {
                            vm.parentSurvey.sectionIds.push(vm.sections[i].id);
                        }
                    };
                    surveysSrvc.updateSurvey(vm.parentSurvey).then(function (response) {
                        surveysSrvc.updateAllSurveys().then(function () {
                            sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function (response) {
                                $state.go('sections_list', {
                                    parentSurveyId: vm.parentSurvey.id
                                });
                            });
                        });
                    });
                }
        });
    }
}());
