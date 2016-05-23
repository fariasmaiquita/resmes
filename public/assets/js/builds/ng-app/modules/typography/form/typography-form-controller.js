define('resmes.typography.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.typography',
    'resmes.typography.model'
    
], function (angular) {

    'use strict';
    
    var resmesTypographyForm = angular.module('resmes.typography.form', []);
    
    resmesTypographyForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.typography.customize', {
            
            url: '/customize/:section',
            resolve: {
                validSectionParam: ['$q', '$stateParams', function ($q, $stateParams) {
                    var deferredViewLoad = $q.defer();
                    
                    if ($stateParams.section == 'headings' ||
                        $stateParams.section == 'body' ||
                        $stateParams.section == 'italics' ||
                        $stateParams.section == 'size' ||
                        $stateParams.section == 'color') {
                        
                        deferredViewLoad.resolve();
                        
                    } else {
                        deferredViewLoad.reject();
                    }
                        
                    return deferredViewLoad.promise;
                }]
            },
            views: {
                'form@resmes.typography' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/typography/form/typography-form-view.html',
                    controller: 'TypographyFormController as typForm'
                }
            }
            
        }).state('resmes.typography.edit', {
            
            url: '/:id/edit',
            views: {
                'form@resmes.typography' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/typography/form/typography-form-view.html',
                    controller: 'TypographyFormController as typForm'
                }
            }
            
        }).state('resmes.typography.delete', {
            
            url: '/:id/delete',
            views: {
                'form@resmes.typography' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/typography/form/typography-form-view.html',
                    controller: 'TypographyFormController as typForm'
                }
            }
            
        });
        
    }]);
    
    resmesTypographyForm.controller('TypographyFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'TypographyModel',
        
        function ($location, $state, $scope, SessionService, TypographyModel) {

            var typForm = this;
            
            
            // HELPER FUNCTIONS FOR LATER
            
            var onFailureShowServerError = function (errorResponse) {
                typForm.formHeaderLoader = false;
                typForm.formTitle = 'Internal Server Error. Request Terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                typForm.formLoading = false;
                typForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var prepView = function (section) {
                
                return SessionService.getResumesOpts().then(function (resumesOpts) {
                    
                    if (section == 'size') {
                        
                        typForm.formSizes = resumesOpts.data['sizes'];
                        typForm.formData.font_size = resumesOpts.data['defaults']['size']['value'];
                        typForm.formSubmitText = 'Customize Size';
                        
                    } else if (section == 'color') {
                        
                        typForm.formPalettes = resumesOpts.data['palettes'];
                        typForm.formData.palette_color = resumesOpts.data['defaults']['palette']['color'];
                        typForm.formSubmitText = 'Customize Color';
                        
                    } else {
                        
                        typForm.formFonts = resumesOpts.data['fonts'];
                        typForm.formData.font_family = resumesOpts.data['defaults']['font']['family'];
                        typForm.formSubmitText = 'Customize Font';
                        
                    }
                    
                    typForm.formCancelText = 'Cancel Entry';
                    
                    return resumesOpts;
                    
                }, onFailureShowServerError);
                
            };
            
            var setFormTitle = function (section) {
                
                if (section == 'size') {
                    typForm.formTitle = 'Choose Custom Font Size';
                } else if (section == 'color') {
                    typForm.formTitle = 'Choose Custom Secondary Color';
                } else {
                    typForm.formTitle = 'Choose ' + section + ' Custom Font';
                }
                
            };
            

            // PREPING: GENERAL STUFF //


            typForm.serverError = false;
            typForm.formIsCreating = $state.is('resmes.typography.customize');
            typForm.formHeaderLoader = true;
            typForm.formUpdateReady = false;
            typForm.formFonts = null;
            typForm.formSizes = null;
            typForm.formPalettes = null;
            typForm.formData = new TypographyModel();
            typForm.formSubmitted = false;
            typForm.formLoading = false;
            
            
            
            // PREPING: VIEW SPECIFICS //


            typForm.formTitle = 'Loading, please wait...';
            
            if (typForm.formIsCreating) {

                // PREPING: CREATE VIEW //

                prepView($state.params.section).then(function () {
                    
                    typForm.formHeaderLoader = false;
                    setFormTitle($state.params.section);
                    
                });
                

            } else {
                
                SessionService.getCurrResumeId().then(function (currResumeId) {

                    TypographyModel.get({
                        resumeId: currResumeId,
                        typographyId: $state.params.id
                    }, function (loadedTyp) {

                        if ($state.is('resmes.typography.edit')) {

                            // PREPING: EDIT VIEW //

                            prepView(loadedTyp.section).then(function (resumeOpts) {
                                
                                typForm.formHeaderLoader = false;
                                setFormTitle(loadedTyp.section);
                                typForm.formData = loadedTyp;
                                
                            });

                        } else {

                            // EXECUTING: DELETE ACTION //

                            var currSection = loadedTyp.section;

                            loadedTyp.$delete({
                                resumeId: currResumeId,
                                typographyId: loadedTyp.id
                            }, function () {

                                $state.go('resmes.typography');
                                $('.preview-canvas')[0].contentWindow.reloadRender();
                                var index = SessionService.getObjIndex(
                                    'id', $state.params.id, $scope.cachedTypographies
                                );
                                if (index > -1) {
                                    $scope.cachedTypographies[index] = {
                                        section: currSection,
                                        empty: true
                                    };
                                }

                            }, onFailureShowServerError);
                                // error from loadedTyp.$remove()*/

                        }

                    }, onFailureShowServerError);
                        // error from TypographyModel.get()

                }, onFailureShowServerError);
                    // error from SessionService.getCurrResumeId()*/
                
            }


            // EXECUTING: FORM SUBMISSION //


            typForm.submitForm = function () {

                typForm.formSubmitted = true;
                typForm.serverError = false;
                typForm.formLoading = true;

                SessionService.getCurrResumeId().then(function (currResumeId) {

                    if (typForm.formIsCreating) {

                        // CREATE ACTION

                        typForm.formData.section = $state.params.section;
                        
                        typForm.formData.$save({ resumeId: currResumeId }, function (savedTyp) {

                            $state.go('resmes.typography');
                            $('.preview-canvas')[0].contentWindow.reloadRender();
                            var index = SessionService.getObjIndex(
                                'section', savedTyp.section, $scope.cachedTypographies
                            );
                            if (index > -1) $scope.cachedTypographies[index] = savedTyp;

                        }, onFailureListServerError);
                            // errors from typForm.formData.$save

                    } else {

                        // UPDATE ACTION //

                        TypographyModel.update({
                            resumeId: currResumeId,
                            typographyId: typForm.formData.id
                        }, typForm.formData, function (updatedTyp) {

                            $state.go('resmes.typography');
                            $('.preview-canvas')[0].contentWindow.reloadRender();
                            var index = SessionService.getObjIndex(
                                'section', updatedTyp.section, $scope.cachedTypographies
                            );
                            if (index > -1) $scope.cachedTypographies[index] = updatedTyp;

                        }, onFailureListServerError);
                            // errors from TypographyModel.update()

                    }

               }, onFailureListServerError);
                    // errors from SessionService.getCurrResumeId()
            }
            
            
        }
    ]);
    
    return resmesTypographyForm;
    
});
