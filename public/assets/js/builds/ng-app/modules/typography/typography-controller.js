define('resmes.typography', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.typography.model',
    'resmes.typography.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesTypography = angular.module('resmes.typography', [
        'resmes.core',
        'resmes.typography.model',
        'resmes.typography.form'
    ]);
    
    resmesTypography.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.typography', {
            url: '/typography',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/typography/typography-view.html',
                    controller: 'TypographyController as typ'
                }
            }
        })
        
    }]);
    
    resmesTypography.controller('TypographyController', [
        
        '$scope',
        'SessionService',
        'TypographyModel',
        
        function ($scope, SessionService, TypographyModel) {

            var typ = this;

            var onFailureShowServerError = function (errorResponse) {
                typ.loading = false;
                typ.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            typ.serverError = false;
            typ.loading = true;
            typ.resumeOpts = null;
            
            typ.prioritySorter = function (typEntry) {
                
                switch(typEntry.section) {
                    case 'headings': 
                        if (typEntry.empty) return 5;
                        return 1;
                    case 'body':
                        if (typEntry.empty) return 6;
                        return 2;
                    case 'italics':
                        if (typEntry.empty) return 7;
                        return 3;
                    default:
                        if (typEntry.empty) return 8;
                        return 4;
                }
                
            };
            
            $scope.cachedTypographies = [
                { section: 'headings', empty: true },
                { section: 'body', empty: true },
                { section: 'italics', empty: true },
                { section: 'size', empty: true },
                { section: 'color', empty: true }
            ];
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                TypographyModel.query({
                    resumeId: currRemuseId
                }, function (loadedTyps) {
                    
                    for (var i=0; i < loadedTyps.length; i++) {
                        var index = SessionService.getObjIndex(
                            'section', loadedTyps[i].section, $scope.cachedTypographies
                        );
                        if (index > -1) $scope.cachedTypographies[index] = loadedTyps[i];
                    }
                    
                    SessionService.getResumesOpts().then(function (resumeOpts) {
                        typ.resumeOpts = resumeOpts.data;
                        typ.loading = false;
                    });
                    
                    
                }, onFailureShowServerError);
                    // error from TypographyModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()

        }
        
    ]);
    
    return resmesTypography;
    
});
