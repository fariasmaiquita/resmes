define('resmes.general.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesGeneralModel = angular.module(
        'resmes.general.model', []
    );
    
    resmesGeneralModel.factory('GeneralModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/general',
                
                {
                    resumeId: '@resumeId',
                    token: localStorage['satellizer_token']
                }
                
            );
            
        }
        
    ]);
    
    return resmesGeneralModel;

});
