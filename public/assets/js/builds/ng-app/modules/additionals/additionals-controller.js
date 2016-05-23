define('resmes.additionals', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.additionals.model',
    'resmes.additionals.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesAdditionals = angular.module('resmes.additionals', [
        'resmes.core',
        'resmes.additionals.model',
        'resmes.additionals.form'
    ]);
    
    resmesAdditionals.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.additionals', {
            url: '/additionals',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/additionals/additionals-view.html',
                    controller: 'AdditionalsController as adt'
                }
            }
        })
        
    }]);
    
    resmesAdditionals.controller('AdditionalsController', [
        
        '$scope',
        'SessionService',
        'AdditionalsModel',
        
        function ($scope, SessionService, AdditionalsModel) {

            var adt = this;

            var onFailureShowServerError = function (errorResponse) {
                adt.loading = false;
                adt.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            adt.serverError = false;
            adt.loading = true;
            
            adt.prioritySorter = function (adtEntry) {
                
                switch(adtEntry.type) {
                    case 'interests': 
                        if (adtEntry.empty) return 4;
                        return 1;
                    case 'testimonial':
                        if (adtEntry.empty) return 5;
                        return 2;
                    default:
                        if (adtEntry.empty) return 6;
                        return 3;
                }
                
            };
            
            $scope.cachedAdditionals = [
                { type: 'interests', empty: true },
                { type: 'testimonial', empty: true },
                { type: 'footer', empty: true }
            ];
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                AdditionalsModel.query({
                    resumeId: currRemuseId
                }, function (loadedAdts) {
                    
                    for (var i=0; i < loadedAdts.length; i++) {
                        var index = SessionService.getObjIndex(
                            'type', loadedAdts[i].type, $scope.cachedAdditionals
                        );
                        if (index > -1) $scope.cachedAdditionals[index] = loadedAdts[i];
                    }
                    adt.loading = false;
                    
                }, onFailureShowServerError);
                    // error from AdditionalsModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()

        }
        
    ]);
    
    return resmesAdditionals;
    
});
