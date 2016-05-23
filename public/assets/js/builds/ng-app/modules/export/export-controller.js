define('resmes.export', [
    
    'angular',
    'angular.uiRouter',
    'filesaver',
    
    'resmes.core',
    
], function (angular) {
    
    'use strict';
    
    var resmesExport = angular.module('resmes.export', ['resmes.core']);
    
    resmesExport.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.export', {
            url: '/export',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/export/export-view.html',
                    controller: 'ExportController as xpt'
                }
            }
        })
        
    }]);
    
    resmesExport.controller('ExportController', [
        
        '$scope',
        '$http',
        '$auth',
        'SessionService',
        
        function ($scope, $http, $auth, SessionService) {

            var xpt = this,
                pdfFile;
            
            var onFailureShowServerError = function (errorResponse) {
                xpt.loading = false;
                xpt.serverError = errorResponse.status;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            xpt.serverError = false;
            xpt.loading = true;
            
            xpt.savePdfFile = function () {
                saveAs(pdfFile, 'Resmes - ' + $scope.previewTitle);
            };
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
                    
                $http.get(
                        
                    location.href.split('#')[0] + 'api/resumes/' +
                    currRemuseId + '/export/stream?token=' +
                    $auth.getToken(),

                    { responseType: 'arraybuffer' }
                    
                ).then(function (pdfResponse) {

                    xpt.loading = false;
                    pdfFile = new Blob([pdfResponse.data], {type: 'application/pdf'});

                }, onFailureShowServerError);
                
            }, onFailureShowServerError);

        }
        
    ]);
    
    return resmesExport;
    
});
