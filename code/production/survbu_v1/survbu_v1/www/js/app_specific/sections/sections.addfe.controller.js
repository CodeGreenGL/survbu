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
                addSecstions: function () {
                    for (var i = 0; i < vm.sections.length; i++) {
                        if (vm.sections[i].adding === true) {
                            vm.parentSurvey.sectionsIds.push(vm.sections[i].id);
                        }
                    };
                    surveySrvc.updateSurvey(vm.parentSurvey).then(function (response) {
                        surveysSrvc.updateAllSurveys().then(function () {
                            sectionsSrvc.updateSections(sectionQuestions).then(function (response) {
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
