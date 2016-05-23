define('resmes.experience.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesExperienceModel = angular.module(
        'resmes.experience.model', []
    );
    
    resmesExperienceModel.factory('ExperienceModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/experience/:experienceId',
                
                {
                    resumeId: '@resumeId',
                    experienceId: '@experienceId',
                    token: localStorage['satellizer_token']
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesExperienceModel;

});
