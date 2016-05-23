define('resmes.layouts.demo', [
    
    'angular',
    'angular.uiRouter',
    
], function (angular) {
    
    'use strict';
    
    var resmesLayoutsDemo = angular.module('resmes.layouts.demo', []);
    
    resmesLayoutsDemo.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.layouts.demo', {
            url: '/:slug/demo',
            resolve: {
                validSlugParam: [
                    '$q',
                    '$stateParams',
                    'SessionService',
                    function ($q, $stateParams, SessionService) {
                        var deferredViewLoad = $q.defer();
                        
                        SessionService.getResumesOpts().then(function (resumeOpts) {
                            var resumeOpts = resumeOpts.data,
                                validSlug = false;
                            
                            for (var i=0; i < resumeOpts['layouts'].length; i++) {
                                if (resumeOpts['layouts'][i]['slug'] == $stateParams.slug) {
                                    validSlug = true;
                                }
                            }
                            
                            if (validSlug) {
                                deferredViewLoad.resolve();
                            } else {
                                deferredViewLoad.reject();
                            }
                            
                        }, function () {
                            deferredViewLoad.reject();
                        });
                        
                        return deferredViewLoad.promise;
                    }
                ]
            },
            views: {
                'demo@resmes.layouts' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/layouts/demo/layouts-demo-view.html',
                    controller: 'LayoutsDemoController as lytDemo'
                }
            }
        })
        
    }]);
    
    resmesLayoutsDemo.controller('LayoutsDemoController', [
        
        '$scope',
        '$state',
        '$auth',
        'SessionService',
        
        function ($scope, $state, $auth, SessionService) {

            var lytDemo = this;
            
            lytDemo.previewUrl = location.href.split('#')[0]
                + 'api/layouts/' + $state.params.slug
                + '/demo?token=' + $auth.getToken();
            
        }
        
    ]);
    
    return resmesLayoutsDemo;
    
});
