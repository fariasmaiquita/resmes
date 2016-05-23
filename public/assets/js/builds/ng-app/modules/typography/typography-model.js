define('resmes.typography.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesTypographyModel = angular.module(
        'resmes.typography.model', []
    );
    
    resmesTypographyModel.factory('TypographyModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/typography/:typographyId',
                
                {
                    resumeId: '@resumeId',
                    typographyId: '@typographyId',
                    token: localStorage['satellizer_token']
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesTypographyModel;

});
