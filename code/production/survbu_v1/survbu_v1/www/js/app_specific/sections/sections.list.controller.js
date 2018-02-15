/*global angular */
(function () {
    'use strict';

    angular
        .module('surveyModule')
        .controller('sectionsListCtrl', control);

    control.$inject = [
        '$state',
        '$ionicPopup',
        'surveysSrvc',
        'sectionsSrvc',
        'questionsSrvc'
    ];

    function control(
        $state,
        $ionicPopup,
        surveysSrvc,
        sectionsSrvc,
        questionsSrvc
    ) {
        var vm = angular.extend(this, {
            sections: sectionsSrvc.getSections(),
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
            addSection: function addSection() {
                $state.go('sections_add');
            },
            selectDetail: function ($event, index) {
                $event.stopPropagation();
                $state.go('sections_detail', {
                    selected: index
                });
            },
            listQuestions: function (index) {
                questionsSrvc.isWaiting(true);
                $state.go('questions_list');

                sectionsSrvc.setCurrentSection(index);
                var selectedSection = sectionsSrvc.getSectionAt(index),
                    sectionQuestions = selectedSection.questionIds;

                if (sectionQuestions.length > 0) {
                    questionsSrvc.updateQuestions(sectionQuestions).then(function () {
                        $state.reload();
                        questionsSrvc.isWaiting(false);
                    });
                } else {
                    questionsSrvc.disposeQuestions();
                    questionsSrvc.isWaiting(false);
                }
            },
            showDeleteAlert: function ($event, index) {
                $event.stopPropagation();

                if (surveysSrvc.getNumSurveys() === 0) {
                    $ionicPopup.alert({
                        title: 'Can\'t delete section from global list!',
                        template: 'Sections can only be deleted via the relevant survey.'
                    });
                } else if (surveysSrvc.getNumSurveys() > 0) {
                    var selectedSection = sectionsSrvc.getSectionAt(index);
                    $ionicPopup.show({
                        title: 'Delete ' + selectedSection.heading,
                        cssClass: 'extendedDeletePopup',
                        template: 'Section will be removed from survey. Would you like to delete section object too?<br/><br/>Questions will be kept.',
                        buttons: [{
                            text: 'Cancel',
                            type: 'button-light'
                        }, {
                            text: 'Keep Section',
                            type: 'button-calm',
                            onTap: function () {
                                return 0;
                            }
                        }, {
                            text: 'Delete Section',
                            type: 'button-assertive',
                            onTap: function () {
                                return 1;
                            }
                        }]
                    }).then(function (response) {
                        if (response === 0) {
                            vm.sections.splice(index, 1);
                            surveysSrvc.deleteSectionFromSurvey(selectedSection.id);
                            console.log('Deleted Section, KEPT section object');
                        } else if (response === 1) {
                            vm.sections.splice(index, 1);
                            sectionsSrvc.deleteSection(selectedSection.id);
                            surveysSrvc.deleteSectionFromSurvey(selectedSection.id);
                            console.log('Deleted Survey, DELETED section object');
                        } else {
                            console.log('User pressed cancel');
                        }
                    });
                }
            }
        });
    }
}());
