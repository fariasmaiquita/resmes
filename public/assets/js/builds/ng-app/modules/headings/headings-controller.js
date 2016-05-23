define('resmes.headings', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.headings.model',
    'resmes.headings.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesHeadings = angular.module('resmes.headings', [
        'resmes.core',
        'resmes.headings.model',
        'resmes.headings.form'
    ]);
    
    resmesHeadings.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.headings', {
            url: '/headings',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/headings/headings-view.html',
                    controller: 'HeadingsController as hdg'
                }
            }
        })
        
    }]);
    
    resmesHeadings.controller('HeadingsController', [
        
        '$scope',
        'SessionService',
        'HeadingsModel',
        
        function ($scope, SessionService, HeadingsModel) {

            var hdg = this;

            var onFailureShowServerError = function (errorResponse) {
                hdg.loading = false;
                hdg.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            hdg.serverError = false;
            hdg.loading = true;
            
            hdg.prioritySorter = function (hdgEntry) {
                
                switch(hdgEntry.section) {
                    case 'Experience': 
                        if (hdgEntry.default) return 4;
                        return 1;
                    case 'Education':
                        if (hdgEntry.default) return 5;
                        return 2;
                    case 'Skills':
                        if (hdgEntry.default) return 5;
                        return 3;
                    default:
                        if (hdgEntry.default) return 6;
                        return 4;
                }
                
            };
            
            $scope.cachedHeadings = [
                { section: 'experience', default: true },
                { section: 'education', default: true },
                { section: 'skills', default: true },
                { section: 'interests', default: true }
            ];
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                HeadingsModel.query({
                    resumeId: currRemuseId
                }, function (loadedHdgs) {
                    
                    for (var i=0; i < loadedHdgs.length; i++) {
                        var index = SessionService.getObjIndex(
                            'section', loadedHdgs[i].section, $scope.cachedHeadings
                        );
                        if (index > -1) $scope.cachedHeadings[index] = loadedHdgs[i];
                    }
                    hdg.loading = false;
                    
                }, onFailureShowServerError);
                    // error from HeadingsModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()*/

        }
        
    ]);
    
    return resmesHeadings;
    
});
