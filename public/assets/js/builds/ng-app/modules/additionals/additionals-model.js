define('resmes.additionals.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesAdditionalsModel = angular.module(
        'resmes.additionals.model', []
    );
    
    resmesAdditionalsModel.factory('AdditionalsModel', [
        
        '$resource',
        '$auth',
        'SessionService',
        
        function($resource, $auth, SessionService) {
            
            return $resource(
                
                location.href.split('#')[0] +
                'api/resumes/:resumeId/additionals/:additionalId',
                
                {
                    resumeId: '@resumeId',
                    additionalId: '@additionalId',
                    token: $auth.getToken()
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesAdditionalsModel;

});
