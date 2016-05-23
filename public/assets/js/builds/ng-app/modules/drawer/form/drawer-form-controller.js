define('resmes.drawer.form', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.drawer'
    
], function (angular) {

    'use strict';
    
    var resmesDrawerForm = angular.module('resmes.drawer.form', []);
    
    resmesDrawerForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.drawer.add', {
            
            url: '/add',
            views: {
                'form@resmes.drawer' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/drawer/form/drawer-form-view.html',
                    controller: 'DrawerFormController as drwForm'
                }
            }
            
        }).state('resmes.drawer.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.drawer' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/drawer/form/drawer-form-view.html',
                    controller: 'DrawerFormController as drwForm'
                }
            }
            
        }).state('resmes.drawer.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.drawer' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/drawer/form/drawer-form-view.html',
                    controller: 'DrawerFormController as drwForm'
                }
            }
            
        });
        
    }]);
    
    resmesDrawerForm.controller('DrawerFormController', [
        
        '$state',
        '$scope',
        'SessionService',
        'ResumesModel',
        
        function ($state, $scope, SessionService, ResumesModel) {

            var drwForm = this;
            
            
            // HELPER FUNCTIONS FOR LATER
            
            
            var onFailureShowServerError = function (errorResponse) {
                drwForm.formHeaderLoader = false;
                drwForm.formTitle = errorResponse.data.error.message ||
                    'Internal Server Error. Request terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                drwForm.formLoading = false;
                drwForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }


            // PREPING: GENERAL STUFF //


            drwForm.serverError = false;
            drwForm.formIsCreating = $state.is('resmes.drawer.add');
            drwForm.formHeaderLoader = !drwForm.formIsCreating;
            drwForm.formUpdateReady = false;
            drwForm.formData = new ResumesModel();
            drwForm.formSubmitted = false;
            drwForm.formLoading = false;
            
            
            // PREPING: VIEW SPECIFICS //


            if (drwForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                drwForm.formTitle = 'Add New Resume';
                drwForm.formSubmitText = 'Add Resume';
                drwForm.formCancelText = 'Cancel Entry';

            } else {

                drwForm.formTitle = 'Loading, please wait...';
                
                ResumesModel.get({
                    id: $state.params.id
                }, function (loadedResume) {

                    if ($state.is('resmes.drawer.edit')) {

                        // PREPING: EDIT VIEW //

                        drwForm.formSubmitText = 'Update Resume';
                        drwForm.formCancelText = 'Discard Changes';
                        drwForm.formUpdateReady = true;
                        drwForm.formHeaderLoader = false;
                        drwForm.formTitle = 'Edit Resume Properties';

                        drwForm.formData = loadedResume;

                    } else {

                        // EXECUTING: DELETE ACTION //

                        SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                            loadedResume.$delete({
                                id: $state.params.id
                            }, function (lastEditedResume) {

                                if ($state.params.id == currResumeId) {
                                    SessionService.setCurrResumeId(lastEditedResume.id);
                                    $scope.setPreviewUrl(lastEditedResume.id);
                                    $scope.currResume.id = lastEditedResume.id;
                                }
                                
                                $state.go('resmes.drawer');
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedResumes
                                );
                                if (index > -1) $scope.cachedResumes.splice(index, 1);

                            }, onFailureShowServerError);
                                // error from loadedResume.$delete()
                            
                        }, onFailureShowServerError);
                            // error from SessionService.getCurrResumeId()

                    }

                }, onFailureShowServerError);
                    // error from ResumesModel.get()
                
            }


            // EXECUTING: FORM SUBMISSION //


            drwForm.submitForm = function () {

                drwForm.formSubmitted = true;
                drwForm.serverError = false;
                drwForm.formLoading = true;
                drwForm.formData.draft = drwForm.saveToDraft ? true : false;

                if (drwForm.formIsCreating) {

                    // CREATE ACTION

                    drwForm.formData.$save(function (savedResume) {
                        $scope.cachedResumes.push(savedResume);
                        $state.go('resmes.drawer');
                    }, onFailureListServerError);
                        // errors from drwForm.formData.$save

                } else {

                    // UPDATE ACTION //

                    ResumesModel.update({
                        id: drwForm.formData.id
                    }, drwForm.formData, function (updatedResume) {

                        $state.go('resmes.drawer');
                        var index = SessionService.getObjIndex(
                            'id', updatedResume.id, $scope.cachedResumes
                        );
                        if (index > -1) {
                            $scope.cachedResumes[index] = updatedResume;
                        }
                        if ($scope.currResume.id == updatedResume.id) {
                            $scope.setPreviewTitle(updatedResume);
                        }

                    }, onFailureListServerError);
                        // errors from ResumesModel.update()

                }

            }
            
            
        }
    ]);
    
    return resmesDrawerForm;
    
});
