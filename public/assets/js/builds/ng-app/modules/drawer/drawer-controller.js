define('resmes.drawer', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.drawer.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesDrawer = angular.module('resmes.drawer', [
        'resmes.core',
        'resmes.drawer.form'
    ]);
    
    resmesDrawer.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.drawer', {
            url: '/drawer',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/drawer/drawer-view.html',
                    controller: 'DrawerController as drw'
                }
            }
        })
        
    }]);
    
    resmesDrawer.factory('ResumesModel', [
        
        '$resource',
        '$auth',
        
        function($resource, $auth) {
            
            return $resource(
                
                location.href.split('#')[0] +
                'api/resumes/:id',
                
                {
                    id: '@id',
                    token: $auth.getToken()
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    resmesDrawer.controller('DrawerController', [
        
        '$scope',
        '$auth',
        'SessionService',
        'ResumesModel',
        
        function ($scope, $auth, SessionService, ResumesModel) {

            var drw = this;

            var onFailureShowServerError = function (errorResponse) {
                drw.loading = false;
                drw.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            var loadResumes = function () {
                
                if ($scope.userSignedIn) {
                
                    SessionService.getCurrResumeId().then(function (currRemuseId) {

                        ResumesModel.query(function (loadedResumes) {
                            $scope.cachedResumes = loadedResumes;
                            $scope.currResume.id = currRemuseId;
                            drw.loading = false;
                        }, onFailureShowServerError);
                            // error from DrawerModel.query()

                    }, onFailureShowServerError);
                        // error from SessionService.getCurrResumeId() */
                }
                
            };
            
            $scope.cachedResumes = [];
            $scope.currResume = { id: null };
            
            drw.serverError = false;
            drw.loading = $scope.userSignedIn ? true : false;
            
            drw.signIn = function () {
                $scope.signIn().then(loadResumes);
            };
            
            drw.convertToDate = function (strDate) {
                return new Date(strDate);
            }
            
            drw.openResume = function (resumeId) {
                SessionService.setCurrResumeId(resumeId);
                $scope.setPreviewUrl(resumeId);
                $scope.currResume.id = resumeId ;
                $('.app-preview-section').mCustomScrollbar('scrollTo', 'top');
            }
            
            loadResumes();

        }
        
    ]);
    
    return resmesDrawer;
    
});
