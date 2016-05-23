define('resmes.legal', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    
], function (angular) {
    
    'use strict';
    
    var resmesLegal = angular.module('resmes.legal', ['resmes.core']);
    
    resmesLegal.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.privacy', {
            
            url: '/privacy',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/legal/legal-view.html',
                    controller: 'LegalController as lgl'
                }
            }
            
        }).state('resmes.terms', {
            
            url: '/terms',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/legal/legal-view.html',
                    controller: 'LegalController as lgl'
                }
            }
            
        })
        
    }]);
    
    resmesLegal.controller('LegalController', [
        
        '$scope',
        '$state',
        'SessionService',
        
        function ($scope, $state, SessionService) {

            var lgl = this;
            
            var onFailureShowServerError = function (errorResponse) {
                lgl.loading = false;
                lgl.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            lgl.serverError = false;
            lgl.loading = true;
            
            SessionService.getResumesOpts().then(function (resumeOpts) {
                
                if ($state.is('resmes.privacy')) {
                    lgl.title = 'Privacy Policy';
                    lgl.content = resumeOpts.data['legal']['privacy'];
                } else {
                    lgl.title = 'Terms and Conditions';
                    lgl.content = resumeOpts.data['legal']['terms'];
                }
                
                lgl.loading = false;
                
            }, onFailureShowServerError);
            
        }
        
    ]);
    
    return resmesLegal;
    
});
