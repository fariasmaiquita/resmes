define('resmes.education.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesEducationModel = angular.module(
        'resmes.education.model', []
    );
    
    resmesEducationModel.factory('EducationModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/education/:educationId',
                
                {
                    resumeId: '@resumeId',
                    educationId: '@educationId',
                    token: localStorage['satellizer_token']
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesEducationModel;

});
