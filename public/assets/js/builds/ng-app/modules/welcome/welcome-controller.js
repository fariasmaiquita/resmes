define('resmes.welcome', [
    
    'angular',
    'angular.uiRouter'
    
], function (angular) {
    
    'use strict';
    
    var resmesWelcome = angular.module('resmes.welcome', []);
    
    resmesWelcome.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.welcome', {
            url: '/welcome',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/welcome/welcome-view.html',
                    controller: 'WelcomeController as wlc'
                }
            }
        })
        
    }]);
    
    resmesWelcome.controller('WelcomeController', [
        
        '$scope',
        
        function ($scope) {

            var wlc = this;
            
        }
        
    ]);
    
    return resmesWelcome;
    
});
