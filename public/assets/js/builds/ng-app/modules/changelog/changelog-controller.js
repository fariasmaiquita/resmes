define('resmes.changelog', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    
], function (angular) {
    
    'use strict';
    
    var resmesChangelog = angular.module('resmes.changelog', ['resmes.core']);
    
    resmesChangelog.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.changelog', {
            url: '/changelog',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/changelog/changelog-view.html',
                    controller: 'ChangelogController as log'
                }
            }
        })
        
    }]);
    
    resmesChangelog.controller('ChangelogController', [
        
        '$scope',
        'SessionService',
        
        function ($scope, SessionService) {

            var log = this;
            
            var onFailureShowServerError = function (errorResponse) {
                log.loading = false;
                log.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            log.serverError = false;
            log.loading = true;
            
            SessionService.getResumesOpts().then(function (resumeOpts) {
                
                log.changes = resumeOpts.data['changelog'];
                log.loading = false;
                
            }, onFailureShowServerError);
            
        }
        
    ]);
    
    return resmesChangelog;
    
});
