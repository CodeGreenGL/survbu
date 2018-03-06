/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsDetailCtrl', control);

    control.$inject = [
        '$state',
        '$stateParams',
        'sectionsSrvc',
        'surveysSrvc'
    ];

    function control(
        $state,
        $stateParams,
        sectionsSrvc,
        surveysSrvc
    ) {
        var sectionId = $stateParams.sectionId,
            parentSurveyId = $stateParams.parentSurveyId,
            vm = angular.extend(this, {
            section: sectionsSrvc.getSectionAt(sectionId),
            parentSurvey: surveysSrvc.getSurveyAt(parentSurveyId),
            submitButton: function () {
                $state.go('sections_list', {
                    parentSurveyId: vm.parentSurvey.id
                });
            },
            referenceCount: function(){
                if(vm.section.referenceCount > 1){
                    return true;}
                else{
                    return false;}
               
            },
            updateSection: function () {
                sectionsSrvc.updateSection(vm.section).then(function (response) { //Needs further attention not to update the reference count

                    return vm.listSections();
                });   
            },
            listSections: function(){
                sectionsSrvc.updateSections(vm.parentSurvey.sectionIds).then(function(){
                    $state.go('sections_list', {
                        parentSurveyId: vm.parentSurvey.id  //response may be renamed to survey and response.id => survey.id
                    });
                })
            }
        });
    }
}());
