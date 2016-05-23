define('resmes.education.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.education',
    'resmes.education.model'
    
], function (angular) {

    'use strict';
    
    var resmesEducationForm = angular.module('resmes.education.form', []);
    
    resmesEducationForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.education.add', {
            
            url: '/add',
            views: {
                'form@resmes.education' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/education/form/education-form-view.html',
                    controller: 'EducationFormController as eduForm'
                }
            }
            
        }).state('resmes.education.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.education' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/education/form/education-form-view.html',
                    controller: 'EducationFormController as eduForm'
                }
            }
            
        }).state('resmes.education.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.education' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/education/form/education-form-view.html',
                    controller: 'EducationFormController as eduForm'
                }
            }
            
        });
        
    }]);
    
    resmesEducationForm.controller('EducationFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'EducationModel',
        
        function ($location, $state, $scope, SessionService, EducationModel) {

            var eduForm = this;
            
            var getYearFrom = function (storedDate) {
                return storedDate ?
                    new Date(storedDate).getFullYear() :
                    null;
            }
            
            var onFailureShowServerError = function (errorResponse) {
                eduForm.formHeaderLoader = false;
                eduForm.formTitle = 'Internal Server Error. Request terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                eduForm.formLoading = false;
                eduForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }


            // PREPING: GENERAL STUFF //


            eduForm.serverError = false;
            eduForm.formIsCreating = $state.is('resmes.education.add');
            eduForm.formHeaderLoader = !eduForm.formIsCreating;
            eduForm.formUpdateReady = false;
            eduForm.formData = new EducationModel();
            eduForm.formSubmitted = false;
            eduForm.formLoading = false;

            eduForm.descriptionOptions = {
                plugins: 'placeholder',
                menubar: false,
                statusbar: false,
                toolbar_items_size: 'small',
                toolbar: 'bold italic | bullist numlist blockquote',
                content_css: $location.absUrl().split('#')[0] + 'assets/css/tinymce-content.css'
            };
            
            
            // PREPING: VIEW SPECIFICS //


            if (eduForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                eduForm.formTitle = 'Add New Education';
                eduForm.formSubmitText = 'Submit Entry';
                eduForm.formCancelText = 'Cancel Entry';

            } else {

                eduForm.formTitle = 'Loading, please wait...';
                
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    
                    EducationModel.get({
                        resumeId: currResumeId,
                        educationId: $state.params.id
                    }, function (loadedEdu) {

                        if ($state.is('resmes.education.edit')) {

                            // PREPING: EDIT VIEW //
                            
                            eduForm.formSubmitText = 'Update Entry';
                            eduForm.formCancelText = 'Discard Changes';
                            eduForm.formUpdateReady = true;
                            eduForm.formHeaderLoader = false;
                            eduForm.formTitle = 'Edit Education Details';
                            
                            eduForm.formData = loadedEdu;
                            eduForm.formData.start_year = 
                                getYearFrom(loadedEdu.start_year);
                            eduForm.formData.end_year =
                                getYearFrom(loadedEdu.end_year);
                            
                        } else {

                            // EXECUTING: DESTROY ACTION //
                            
                            loadedEdu.$delete({
                                resumeId: currResumeId,
                                educationId: loadedEdu.id
                            }, function () {
                                
                                $state.go('resmes.education');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedEducations
                                );
                                if (index > -1) $scope.cachedEducations.splice(index, 1);
                                
                            }, onFailureShowServerError);
                                // error from loadedEdu.$remove()
                            
                        }
                        
                    }, onFailureShowServerError);
                        // error from EducationModel.get()
                    
                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()
                
            }
            

            // EXECUTING: FORM SUBMISSION //


            eduForm.submitForm = function () {

                eduForm.formSubmitted = true;

                if (eduForm.form.$valid) {

                    eduForm.serverError = false;
                    eduForm.formLoading = true;

                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        if (eduForm.formIsCreating) {
                        
                            // CREATE ACTION
                            
                            eduForm.formData.$save({ resumeId: currResumeId }, function (savedEdu) {
                                $scope.cachedEducations.push(savedEdu);
                                $state.go('resmes.education');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                            }, onFailureListServerError);
                                // error from eduForm.formData.$save
                            
                        } else {

                            // UPDATE ACTION //
                            
                            EducationModel.update({
                                resumeId: currResumeId,
                                educationId: eduForm.formData.id
                            }, eduForm.formData, function (updatedEdu) {
                                
                                $state.go('resmes.education');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', updatedEdu.id, $scope.cachedEducations
                                );
                                if (index > -1) $scope.cachedEducations[index] = updatedEdu;
                                
                            }, onFailureListServerError);

                        }

                   }, onFailureListServerError);
                        // error from SessionService.getCurrResumeId()
                }
            }
            
            
        }
    ]);
    
    return resmesEducationForm;
    
});
