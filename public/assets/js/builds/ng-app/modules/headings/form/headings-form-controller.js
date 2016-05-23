define('resmes.headings.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.headings',
    'resmes.headings.model'
    
], function (angular) {

    'use strict';
    
    var resmesHeadingsForm = angular.module('resmes.headings.form', []);
    
    resmesHeadingsForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.headings.add', {
            
            url: '/add/:section',
            resolve: {
                validSectionParam: ['$q', '$stateParams', function ($q, $stateParams) {
                    var deferredViewLoad = $q.defer();
                    
                    if ($stateParams.section == 'experience' ||
                        $stateParams.section == 'education' ||
                        $stateParams.section == 'skills' ||
                        $stateParams.section == 'interests') {
                        
                        deferredViewLoad.resolve();
                        
                    } else {
                        deferredViewLoad.reject();
                    }
                        
                    return deferredViewLoad.promise;
                }]
            },
            views: {
                'form@resmes.headings' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/headings/form/headings-form-view.html',
                    controller: 'HeadingsFormController as hdgForm'
                }
            }
            
        }).state('resmes.headings.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.headings' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/headings/form/headings-form-view.html',
                    controller: 'HeadingsFormController as hdgForm'
                }
            }
            
        }).state('resmes.headings.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.headings' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/headings/form/headings-form-view.html',
                    controller: 'HeadingsFormController as hdgForm'
                }
            }
            
        });
        
    }]);
    
    resmesHeadingsForm.controller('HeadingsFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'HeadingsModel',
        
        function ($location, $state, $scope, SessionService, HeadingsModel) {

            var hdgForm = this;
            
            
            // HELPER FUNCTIONS FOR LATER
            
            var onFailureShowServerError = function (errorResponse) {
                hdgForm.formHeaderLoader = false;
                hdgForm.formTitle = 'Internal Server Error. Request Terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                hdgForm.formLoading = false;
                hdgForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            
            // PREPING: GENERAL STUFF //


            hdgForm.serverError = false;
            hdgForm.formIsCreating = $state.is('resmes.headings.add');
            hdgForm.formHeaderLoader = !hdgForm.formIsCreating;
            hdgForm.formUpdateReady = false;
            hdgForm.formData = new HeadingsModel();
            hdgForm.formSubmitted = false;
            hdgForm.formLoading = false;
            
            hdgForm.charCounter = {
                isCounting: false,
                count: null
            }
            
            hdgForm.showCounter = function (strSrc) {
                hdgForm.charCounter.isCounting = true;
                if (hdgForm.formData[strSrc]) {
                    hdgForm.charCounter.count = hdgForm.formData[strSrc].length;
                } else {
                    hdgForm.charCounter.count = 0;
                }
            };
            
            hdgForm.getCounterClass = function () {
                return hdgForm.charCounter.count < 50 ? '' : 'bold-red';
            };
            
            hdgForm.hideCounter = function () {
                hdgForm.charCounter.isCounting = false;
            };
            
            hdgForm.updateTitles = function () {
                if (hdgForm.hdgDisabled) {
                    hdgForm.formData.title = null;
                    hdgForm.formData.subtitle = null;
                }
            };
            
            
            // PREPING: VIEW SPECIFICS //


            if (hdgForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                hdgForm.formTitle = $state.params.section + ' Custom Heading';
                hdgForm.formSubmitText = 'Submit Entry';
                hdgForm.formCancelText = 'Cancel Entry';

            } else {

                hdgForm.formTitle = 'Loading, please wait...';
                
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    
                    HeadingsModel.get({
                        resumeId: currResumeId,
                        headingId: $state.params.id
                    }, function (loadedHdg) {

                        if ($state.is('resmes.headings.edit')) {

                            // PREPING: EDIT VIEW //
                            
                            hdgForm.formTitle = loadedHdg.section + ' Custom Heading';
                            hdgForm.formSubmitText = 'Update Entry';
                            hdgForm.formCancelText = 'Discard Changes';
                            hdgForm.formUpdateReady = true;
                            hdgForm.formHeaderLoader = false;
                            hdgForm.formData = loadedHdg;
                            
                            if (!loadedHdg.title) {
                                hdgForm.hdgDisabled = true;
                            }
                            
                        } else {

                            // EXECUTING: DELETE ACTION //
                            
                            var currSection = loadedHdg.section;
                            
                            loadedHdg.$delete({
                                resumeId: currResumeId,
                                headingId: loadedHdg.id
                            }, function () {
                                
                                $state.go('resmes.headings');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedHeadings
                                );
                                if (index > -1) {
                                    $scope.cachedHeadings[index] = {
                                        section: currSection,
                                        default: true
                                    };
                                }
                                
                            }, onFailureShowServerError);
                                // error from loadedHdg.$remove()
                            
                        }
                        
                    }, onFailureShowServerError);
                        // error from HeadingsModel.get()
                    
                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()
                
            }


            // EXECUTING: FORM SUBMISSION //


            hdgForm.submitForm = function () {

                hdgForm.formSubmitted = true;

                if (hdgForm.form.$valid) {

                    hdgForm.serverError = false;
                    hdgForm.formLoading = true;
                    
                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        if (hdgForm.formIsCreating) {
                        
                            // CREATE ACTION
                            
                            hdgForm.formData.section = $state.params.section;
                            
                            hdgForm.formData.$save({ resumeId: currResumeId }, function (savedHdg) {
                                
                                $state.go('resmes.headings');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'section', savedHdg.section, $scope.cachedHeadings
                                );
                                if (index > -1) $scope.cachedHeadings[index] = savedHdg;
                                
                            }, onFailureListServerError);
                                // errors from hdgForm.formData.$save
                            
                        } else {

                            // UPDATE ACTION //
                            
                            HeadingsModel.update({
                                resumeId: currResumeId,
                                headingId: hdgForm.formData.id
                            }, hdgForm.formData, function (updatedHdg) {
                                
                                $state.go('resmes.headings');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'section', updatedHdg.section, $scope.cachedHeadings
                                );
                                if (index > -1) $scope.cachedHeadings[index] = updatedHdg;
                                
                            }, onFailureListServerError);
                                // errors from HeadingsModel.update()

                        }

                   }, onFailureListServerError);
                        // errors from SessionService.getCurrResumeId()
                }
            }
            
            
            
        }
    ]);
    
    return resmesHeadingsForm;
    
});
