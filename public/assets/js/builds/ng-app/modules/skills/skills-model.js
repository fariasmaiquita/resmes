define('resmes.skills.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesSkillsModel = angular.module(
        'resmes.skills.model', []
    );
    
    resmesSkillsModel.factory('SkillsModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/skills/:skillId',
                
                {
                    resumeId: '@resumeId',
                    skillId: '@skillId',
                    token: localStorage['satellizer_token']
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesSkillsModel;

});
