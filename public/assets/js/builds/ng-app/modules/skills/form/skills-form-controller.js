define('resmes.skills.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.skills',
    'resmes.skills.model'
    
], function (angular) {

    'use strict';
    
    var resmesSkillsForm = angular.module('resmes.skills.form', []);
    
    resmesSkillsForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.skills.add', {
            
            url: '/add',
            views: {
                'form@resmes.skills' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/skills/form/skills-form-view.html',
                    controller: 'SkillsFormController as sklForm'
                }
            }
            
        }).state('resmes.skills.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.skills' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/skills/form/skills-form-view.html',
                    controller: 'SkillsFormController as sklForm'
                }
            }
            
        }).state('resmes.skills.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.skills' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/skills/form/skills-form-view.html',
                    controller: 'SkillsFormController as sklForm'
                }
            }
            
        });
        
    }]);
    
    resmesSkillsForm.controller('SkillsFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'SkillsModel',
        
        function ($location, $state, $scope, SessionService, SkillsModel) {

            var sklForm = this;
            
             var onFailureShowServerError = function (errorResponse) {
                sklForm.formHeaderLoader = false;
                sklForm.formTitle = 'Internal Server Error. Request terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                sklForm.formLoading = false;
                sklForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }


            // PREPING: GENERAL STUFF //


            sklForm.serverError = false;
            sklForm.formIsCreating = $state.is('resmes.skills.add');
            sklForm.formHeaderLoader = !sklForm.formIsCreating;
            sklForm.formUpdateReady = false;
            sklForm.formData = new SkillsModel();
            sklForm.formSubmitted = false;
            sklForm.formLoading = false;

            sklForm.detailsOptions = {
                plugins: 'placeholder',
                menubar: false,
                statusbar: false,
                toolbar_items_size: 'small',
                toolbar: 'bold italic | bullist numlist blockquote',
                content_css: $location.absUrl().split('#')[0] + 'assets/css/tinymce-content.css'
            };
            
            
            // PREPING: VIEW SPECIFICS //


            if (sklForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                sklForm.formTitle = 'Add New Skill';
                sklForm.formSubmitText = 'Submit Entry';
                sklForm.formCancelText = 'Cancel Entry';

            } else {

                sklForm.formTitle = 'Loading, please wait...';
                
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    
                    SkillsModel.get({
                        resumeId: currResumeId,
                        skillId: $state.params.id
                    }, function (loadedSkl) {

                        if ($state.is('resmes.skills.edit')) {

                            // PREPING: EDIT VIEW //
                            
                            sklForm.formSubmitText = 'Update Entry';
                            sklForm.formCancelText = 'Discard Changes';
                            sklForm.formUpdateReady = true;
                            sklForm.formHeaderLoader = false;
                            sklForm.formTitle = 'Edit Skill Details';
                            sklForm.formData = loadedSkl;
                            
                        } else {

                            // EXECUTING: DESTROY ACTION //
                            
                            loadedSkl.$delete({
                                resumeId: currResumeId,
                                skillId: loadedSkl.id
                            }, function () {
                                
                                $state.go('resmes.skills');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedSkills
                                );
                                if (index > -1) $scope.cachedSkills.splice(index, 1);
                                
                            }, onFailureShowServerError);
                                // error from loadedSkl.$remove()
                            
                        }
                        
                    }, onFailureShowServerError);
                        // error from SkillsModel.get()
                    
                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()
                
            }
            

            // EXECUTING: FORM SUBMISSION //


            sklForm.submitForm = function () {

                sklForm.formSubmitted = true;

                if (sklForm.form.$valid) {

                    sklForm.serverError = false;
                    sklForm.formLoading = true;

                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        if (sklForm.formIsCreating) {
                        
                            // CREATE ACTION
                            
                            sklForm.formData.$save({ resumeId: currResumeId }, function (savedSkl) {
                                $scope.cachedSkills.push(savedSkl);
                                $state.go('resmes.skills');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                            }, onFailureListServerError);
                                // error from sklForm.formData.$save
                            
                        } else {

                            // UPDATE ACTION //
                            
                            SkillsModel.update({
                                resumeId: currResumeId,
                                skillId: sklForm.formData.id
                            }, sklForm.formData, function (updatedSkl) {
                                
                                $state.go('resmes.skills');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', updatedSkl.id, $scope.cachedSkills
                                );
                                if (index > -1) $scope.cachedSkills[index] = updatedSkl;
                                
                            }, onFailureListServerError);

                        }

                   }, onFailureListServerError);
                        // error from SessionService.getCurrResumeId()
                }
            }
            
        }
        
    ]);
    
    return resmesSkillsForm;
    
});
