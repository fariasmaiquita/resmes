define('resmes.additionals.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.additionals',
    'resmes.additionals.model'
    
], function (angular) {

    'use strict';
    
    var resmesAdditionalsForm = angular.module('resmes.additionals.form', []);
    
    resmesAdditionalsForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.additionals.add', {
            
            url: '/add/:type',
            resolve: {
                validTypeParam: ['$q', '$stateParams', function ($q, $stateParams) {
                    var deferredViewLoad = $q.defer();
                    
                    if ($stateParams.type == 'interests' ||
                        $stateParams.type == 'testimonial' ||
                        $stateParams.type == 'footer') {
                        
                        deferredViewLoad.resolve();
                        
                    } else {
                        deferredViewLoad.reject();
                    }
                        
                    return deferredViewLoad.promise;
                }]
            },
            views: {
                'form@resmes.additionals' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/additionals/form/additionals-form-view.html',
                    controller: 'AdditionalsFormController as adtForm'
                }
            }
            
        }).state('resmes.additionals.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.additionals' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/additionals/form/additionals-form-view.html',
                    controller: 'AdditionalsFormController as adtForm'
                }
            }
            
        }).state('resmes.additionals.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.additionals' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/additionals/form/additionals-form-view.html',
                    controller: 'AdditionalsFormController as adtForm'
                }
            }
            
        });
        
    }]);
    
    resmesAdditionalsForm.controller('AdditionalsFormController', [
        
        '$state',
        '$scope',
        'SessionService',
        'AdditionalsModel',
        
        function ($state, $scope, SessionService, AdditionalsModel) {

            var adtForm = this;
            
            
            // HELPER FUNCTIONS FOR LATER
            
            var onFailureShowServerError = function (errorResponse) {
                adtForm.formHeaderLoader = false;
                adtForm.formTitle = 'Internal Server Error. Request Terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                adtForm.formLoading = false;
                adtForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            var setViewSpecifics = function (entryType) {
                
                if (entryType == 'interests') {
                    adtForm.formContentPlaceholder = '(Ex: "Snowboarding, Repairing watches, ...")';
                    adtForm.formTip = 'Use bulleted lists, or separate each with commas.';
                } else if (entryType == 'testimonial') {
                    adtForm.formContentPlaceholder = 'Quote from Author about you / your work';
                    adtForm.formTip = 'Use the blockquote formatting for a more stylized quote display.';
                } else {
                    adtForm.formContentPlaceholder = '(Ex: "References available on request.")';
                    adtForm.formTip = 'The ideal place for some final remarks.';
                }
                
            };


            // PREPING: GENERAL STUFF //


            adtForm.serverError = false;
            adtForm.formIsCreating = $state.is('resmes.additionals.add');
            adtForm.formHeaderLoader = !adtForm.formIsCreating;
            adtForm.formUpdateReady = false;
            adtForm.formData = new AdditionalsModel();
            adtForm.formTestimonial = $state.params.type == 'testimonial';
            adtForm.formSubmitted = false;
            adtForm.formLoading = false;

            adtForm.contentOptions = {
                plugins: 'placeholder',
                menubar: false,
                statusbar: false,
                toolbar_items_size: 'small',
                toolbar: 'bold italic | bullist numlist blockquote',
                content_css: location.href.split('#')[0] + 'assets/css/tinymce-content.css'
            };

            
            
            // PREPING: VIEW SPECIFICS //


            if (adtForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                setViewSpecifics($state.params.type);
                adtForm.formTitle = 'Add ' + $state.params.type;
                adtForm.formSubmitText = 'Submit Entry';
                adtForm.formCancelText = 'Cancel Entry';

            } else {

                adtForm.formTitle = 'Loading, please wait...';
                
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    
                    AdditionalsModel.get({
                        resumeId: currResumeId,
                        additionalId: $state.params.id
                    }, function (loadedAdt) {

                        if ($state.is('resmes.additionals.edit')) {

                            // PREPING: EDIT VIEW //
                            
                            setViewSpecifics(loadedAdt.type);
                            adtForm.formSubmitText = 'Update Entry';
                            adtForm.formCancelText = 'Discard Changes';
                            adtForm.formUpdateReady = true;
                            adtForm.formHeaderLoader = false;
                            adtForm.formTitle = 'Edit ' + loadedAdt.type;
                            adtForm.formTestimonial = loadedAdt.type == 'testimonial';
                            adtForm.formData = loadedAdt;
                            
                        } else {

                            // EXECUTING: DELETE ACTION //
                            
                            var currType = loadedAdt.type;
                            
                            loadedAdt.$delete({
                                resumeId: currResumeId,
                                additionalId: loadedAdt.id
                            }, function () {
                                
                                $state.go('resmes.additionals');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedAdditionals
                                );
                                if (index > -1) {
                                    $scope.cachedAdditionals[index] = {
                                        type: currType,
                                        empty: true
                                    };
                                }
                                
                            }, onFailureShowServerError);
                                // error from loadedAdt.$remove()
                            
                        }
                        
                    }, onFailureShowServerError);
                        // error from AdditionalsModel.get()
                    
                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()
                
            }


            // EXECUTING: FORM SUBMISSION //


            adtForm.submitForm = function () {

                adtForm.formSubmitted = true;

                if (adtForm.form.$valid) {

                    adtForm.serverError = false;
                    adtForm.formLoading = true;
                    
                    //console.log(adtForm.formData);
                    
                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        if (adtForm.formIsCreating) {
                        
                            // CREATE ACTION
                            
                            adtForm.formData.type = $state.params.type;
                            
                            adtForm.formData.$save({ resumeId: currResumeId }, function (savedAdt) {
                                
                                $state.go('resmes.additionals');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'type', savedAdt.type, $scope.cachedAdditionals
                                );
                                if (index > -1) $scope.cachedAdditionals[index] = savedAdt;
                                
                            }, onFailureListServerError);
                                // errors from adtForm.formData.$save
                            
                        } else {

                            // UPDATE ACTION //
                            
                            //adtForm.formData.type = 
                            
                            AdditionalsModel.update({
                                resumeId: currResumeId,
                                additionalId: adtForm.formData.id
                            }, adtForm.formData, function (updatedAdt) {
                                
                                $state.go('resmes.additionals');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'type', updatedAdt.type, $scope.cachedAdditionals
                                );
                                if (index > -1) $scope.cachedAdditionals[index] = updatedAdt;
                                
                            }, onFailureListServerError);
                                // errors from AdditionalsModel.update()

                        }

                   }, onFailureListServerError);
                        // errors from SessionService.getCurrResumeId()
                }
            }
            
            
        }
    ]);
    
    return resmesAdditionalsForm;
    
});
