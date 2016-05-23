define('resmes.headings.model', [
    
    'angular',
    'angular.resource'

], function (angular) {
    
    'use strict';
    
    var resmesHeadingsModel = angular.module(
        'resmes.headings.model', []
    );
    
    resmesHeadingsModel.factory('HeadingsModel', [
        
        '$resource',
        '$location',
        'SessionService',
        
        function($resource, $location, SessionService) {
            
            return $resource(
                
                $location.absUrl().split('#')[0] +
                'api/resumes/:resumeId/headings/:headingId',
                
                {
                    resumeId: '@resumeId',
                    headingId: '@headingId',
                    token: localStorage['satellizer_token']
                },
                
                { 'update': { method:'PUT' } }
                
            );
            
        }
        
    ]);
    
    return resmesHeadingsModel;

});
