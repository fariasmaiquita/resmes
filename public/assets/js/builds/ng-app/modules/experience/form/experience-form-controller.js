define('resmes.experience.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.experience',
    'resmes.experience.model'
    
], function (angular) {

    'use strict';
    
    var resmesExperienceForm = angular.module('resmes.experience.form', []);
    
    resmesExperienceForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.experience.add', {
            
            url: '/add',
            views: {
                'form@resmes.experience' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/experience/form/experience-form-view.html',
                    controller: 'ExperienceFormController as expForm'
                }
            }
            
        }).state('resmes.experience.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.experience' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/experience/form/experience-form-view.html',
                    controller: 'ExperienceFormController as expForm'
                }
            }
            
        }).state('resmes.experience.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.experience' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/experience/form/experience-form-view.html',
                    controller: 'ExperienceFormController as expForm'
                }
            }
            
        });
        
    }]);
    
    resmesExperienceForm.controller('ExperienceFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'ExperienceModel',
        
        function ($location, $state, $scope, SessionService, ExperienceModel) {

            var expForm = this;
            
            
            // HELPER FUNCTIONS FOR LATER
            
            
            var getTimeFrom = function (enteredDate) {
                return enteredDate ?
                    new Date(enteredDate + '-01').getTime() / 1000 :
                    null;
            };
            
            var getEnteredDateFrom = function (storedDate) {
                var dateObj = new Date(storedDate),
                    dateYear = dateObj.getFullYear(),
                    dateMonth = dateObj.getMonth() + 1;
                return dateYear + '-' + (dateMonth <  10 ? '0' : '') + dateMonth;
            }
            
            var onFailureShowServerError = function (errorResponse) {
                expForm.formHeaderLoader = false;
                expForm.formTitle = 'Internal Server Error. Request terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                expForm.formLoading = false;
                expForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }


            // PREPING: GENERAL STUFF //


            expForm.serverError = false;
            expForm.formIsCreating = $state.is('resmes.experience.add');
            expForm.formHeaderLoader = !expForm.formIsCreating;
            expForm.formUpdateReady = false;
            expForm.formData = new ExperienceModel();
            expForm.formSubmitted = false;
            expForm.formLoading = false;

            expForm.descriptionOptions = {
                plugins: 'placeholder',
                menubar: false,
                statusbar: false,
                toolbar_items_size: 'small',
                toolbar: 'bold italic | bullist numlist blockquote',
                content_css: $location.absUrl().split('#')[0] + 'assets/css/tinymce-content.css'
            };

            expForm.getTodaysDate = function () {
                return new Date().toString();
            };
            
            expForm.updateEndDate = function () {
                if (expForm.status) expForm.formData.entered_end_date = '';
            };
            
            
            // PREPING: VIEW SPECIFICS //


            if (expForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                expForm.formTitle = 'Add New Position';
                expForm.formSubmitText = 'Submit Entry';
                expForm.formCancelText = 'Cancel Entry';

            } else {

                expForm.formTitle = 'Loading, please wait...';
                
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    
                    ExperienceModel.get({
                        resumeId: currResumeId,
                        experienceId: $state.params.id
                    }, function (loadedExp) {

                        if ($state.is('resmes.experience.edit')) {

                            // PREPING: EDIT VIEW //
                            
                            expForm.formSubmitText = 'Update Entry';
                            expForm.formCancelText = 'Discard Changes';
                            expForm.formUpdateReady = true;
                            expForm.formHeaderLoader = false;
                            expForm.formTitle = 'Edit Position Details';
                            
                            expForm.formData = loadedExp;
                            expForm.formData.entered_start_date = 
                                getEnteredDateFrom(loadedExp.start_date);
                            
                            if (loadedExp.end_date) {
                                expForm.formData.entered_end_date = 
                                    getEnteredDateFrom(loadedExp.end_date);
                            } else {
                                expForm.status = true;
                            }
                            
                        } else {

                            // EXECUTING: DELETE ACTION //
                            
                            loadedExp.$delete({
                                resumeId: currResumeId,
                                experienceId: loadedExp.id
                            }, function () {
                                
                                $state.go('resmes.experience');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedExperiences
                                );
                                if (index > -1) $scope.cachedExperiences.splice(index, 1);
                                
                            }, onFailureShowServerError);
                                // error from loadedExp.$remove()
                            
                        }
                        
                    }, onFailureShowServerError);
                        // error from ExperienceModel.get()
                    
                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()
                
            }


            // EXECUTING: FORM SUBMISSION //


            expForm.submitForm = function () {

                expForm.formSubmitted = true;

                if (expForm.form.$valid) {

                    expForm.serverError = false;
                    expForm.formLoading = true;
                    
                    expForm.formData.start_date = getTimeFrom(expForm.formData.entered_start_date);
                    expForm.formData.end_date = getTimeFrom(expForm.formData.entered_end_date);
                    
                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        if (expForm.formIsCreating) {
                        
                            // CREATE ACTION
                            
                            expForm.formData.$save({ resumeId: currResumeId }, function (savedExp) {
                                $scope.cachedExperiences.push(savedExp);
                                $state.go('resmes.experience');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                            }, onFailureListServerError);
                                // errors from expForm.formData.$save
                            
                        } else {

                            // UPDATE ACTION //
                            
                            ExperienceModel.update({
                                resumeId: currResumeId,
                                experienceId: expForm.formData.id
                            }, expForm.formData, function (updatedExp) {
                                
                                $state.go('resmes.experience');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', updatedExp.id, $scope.cachedExperiences
                                );
                                if (index > -1) $scope.cachedExperiences[index] = updatedExp;
                                
                            }, onFailureListServerError);
                                // errors from ExperienceModel.update()

                        }

                   }, onFailureListServerError);
                        // errors from SessionService.getCurrResumeId()
                }
            }
            
            
        }
    ]);
    
    return resmesExperienceForm;
    
});
