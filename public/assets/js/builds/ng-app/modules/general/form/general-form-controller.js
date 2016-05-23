define('resmes.general.form', [
    
    'angular',
    'angular.uiRouter',
    'angular.uiTinymce',
    
    'resmes.core',
    'resmes.core.services',
    'resmes.general',
    'resmes.general.model'
    
], function (angular) {

    'use strict';
    
    var resmesGeneralForm = angular.module('resmes.general.form', []);
    
    resmesGeneralForm.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.general.edit', {
            url: '/edit/:section',
            resolve: {
                validSectionParam: ['$q', '$stateParams', function ($q, $stateParams) {
                    var deferredViewLoad = $q.defer();
                    
                    if ($stateParams.section == 'profile' ||
                        $stateParams.section == 'contact') {
                        
                        deferredViewLoad.resolve();
                        
                    } else {
                        deferredViewLoad.reject();
                    }
                        
                    return deferredViewLoad.promise;
                }]
            },
            views: {
                'form@resmes.general' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/general/form/general-form-view.html',
                    controller: 'GeneralFormController as gnrForm'
                }
            }
        });
        
    }]);
    
    resmesGeneralForm.controller('GeneralFormController', [
        
        '$location',
        '$state',
        '$scope',
        'SessionService',
        'GeneralModel',
        
        function ($location, $state, $scope, SessionService, GeneralModel) {

            var gnrForm = this,
                tipText = {
                    profile: 'Use the Resume Headline to boast your age or a particular expertise',
                    contact: 'Double-check the Phone Number, invalid formats are not detected.'
                };
            
            
            
            // HELPER FUNCTIONS FOR LATER
            
            
            var onFailureShowServerError = function (errorResponse) {
                gnrForm.formHeaderLoader = false;
                gnrForm.formTitle = 'Internal Server Error. Request terminated.';
                console.log('Error Details for Debugging', errorResponse);
            };
            
            var onFailureListServerError = function (errorResponse) {
                gnrForm.formLoading = false;
                gnrForm.serverError = errorResponse.data;
                console.log('Error Details for Debugging', errorResponse);
            }


            // PREPING: GENERAL STUFF //


            gnrForm.serverError = false;
            gnrForm.formHeaderLoader = true;
            gnrForm.formData = new GeneralModel();
            gnrForm.formSubmitted = false;
            gnrForm.formLoading = false;
            gnrForm.formUpdateReady = false;
            gnrForm.formTitle = 'Loading, please wait...';
            gnrForm.formTip = tipText[$state.params.section];
            
            gnrForm.summaryOptions = {
                plugins: 'placeholder',
                menubar: false,
                statusbar: false,
                toolbar_items_size: 'small',
                toolbar: 'bold italic | bullist numlist blockquote',
                content_css: $location.absUrl().split('#')[0] + 'assets/css/tinymce-content.css'
            };
            
            SessionService.getCurrResumeId().then(function (currResumeId) {

                GeneralModel.query({
                    resumeId: currResumeId,
                }, function (loadedGnrs) {

                    if (loadedGnrs.length > 0) {
                        gnrForm.formData = loadedGnrs[0];
                    }
                    
                    gnrForm.formUpdateReady = true;
                    gnrForm.formHeaderLoader = false;
                    gnrForm.formTitle = 'Edit ' + $state.params.section + ' Info';
                    gnrForm.formData.profileEntry = $state.params.section == 'profile';

                }, onFailureShowServerError);
                    // error from GeneralModel.query()

            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()
            
            
            
            // EXECUTING: FORM SUBMISSION //


            gnrForm.submitForm = function () {

                gnrForm.formSubmitted = true;

                if (gnrForm.form.$valid) {

                    gnrForm.serverError = false;
                    gnrForm.formLoading = true;
                    
                    SessionService.getCurrResumeId().then(function (currResumeId) {
                        
                        gnrForm.formData.$save({ resumeId: currResumeId }, function (savedGnr) {
                            $scope.cachedGeneral.pop();
                            $scope.cachedGeneral.push(savedGnr);
                            $state.go('resmes.general');
                            $('.preview-canvas')[0].contentWindow.reloadRender();
                        }, onFailureListServerError);
                            // errors from gnrForm.formData.$save

                   }, onFailureListServerError);
                        // errors from SessionService.getCurrResumeId()
                }
            }
            
            
        }
    ]);
    
    return resmesGeneralForm;
    
});
