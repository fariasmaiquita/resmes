define('resmes.layouts', [
    
    'angular',
    'angular.uiRouter',
    'filesaver',
    
    'resmes.layouts.demo'
    
], function (angular) {
    
    'use strict';
    
    var resmesLayouts = angular.module('resmes.layouts', [
        'resmes.layouts.demo'
    ]);
    
    resmesLayouts.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.layouts', {
            url: '/layouts',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/layouts/layouts-view.html',
                    controller: 'LayoutsController as lyt'
                }
            }
        })
        
    }]);
    
    resmesLayouts.controller('LayoutsController', [
        
        '$scope',
        '$http',
        '$auth',
        'SessionService',
        
        function ($scope, $http, $auth, SessionService) {

            var lyt = this;

            var onFailureShowServerError = function (errorResponse) {
                lyt.loading = false;
                lyt.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            var uppercaseStr = function (str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            
            lyt.serverError = false;
            lyt.loading = true;
            lyt.resumeOpts = null;
            lyt.downloading = false;
            
            lyt.saveDemoPdf = function (slug) {
                
                lyt.downloading = true;
                
                $http.get(
                        
                    location.href.split('#')[0] + 'api/layouts/' +
                    slug + '/demo/stream?token=' +
                    $auth.getToken(),

                    { responseType: 'arraybuffer' }
                    
                ).then(function (pdfResponse) {
                    
                    var pdfFile = new Blob([pdfResponse.data], {type: 'application/pdf'});
                    
                    saveAs(pdfFile, 'Resmes - Layout ' + uppercaseStr(slug) + ' Demo');
                    
                    lyt.downloading = false;
                    
                });
                
            };
            
            SessionService.getResumesOpts().then(function (resumeOpts) {
                lyt.resumeOpts = resumeOpts.data;
                lyt.loading = false;
            }, onFailureShowServerError);
            
        }
        
    ]);
    
    return resmesLayouts;
    
});
