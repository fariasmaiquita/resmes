define('resmes.general', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.general.model',
    'resmes.general.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesGeneral = angular.module('resmes.general', [
        'resmes.core',
        'resmes.general.model',
        'resmes.general.form'
    ]);
    
    resmesGeneral.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.general', {
            url: '/general',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/general/general-view.html',
                    controller: 'GeneralController as gnr'
                }
            }
        })
        
    }]);
    
    resmesGeneral.controller('GeneralController', [
        
        '$scope',
        'SessionService',
        'GeneralModel',
        
        function ($scope, SessionService, GeneralModel) {

            var gnr = this;

            var onFailureShowServerError = function (errorResponse) {
                gnr.loading = false;
                gnr.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            gnr.serverError = false;
            gnr.loading = true;
            
            $scope.cachedGeneral = [{}];
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                GeneralModel.query({
                    resumeId: currRemuseId
                }, function (loadedGnrs) {
                    
                    if (loadedGnrs.length > 0) {
                        $scope.cachedGeneral = loadedGnrs;
                    }
                    gnr.loading = false;
                    
                }, onFailureShowServerError);
                    // error from GeneralModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()*/

        }
        
    ]);
    
    return resmesGeneral;
    
});
