define('resmes.experience', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.experience.model',
    'resmes.experience.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesExperience = angular.module('resmes.experience', [
        'resmes.core',
        'resmes.experience.model',
        'resmes.experience.form'
    ]);
    
    resmesExperience.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.experience', {
            url: '/experience',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/experience/experience-view.html',
                    controller: 'ExperienceController as exp'
                }
            }
        })
        
    }]);
    
    resmesExperience.controller('ExperienceController', [
        
        '$scope',
        'SessionService',
        'ExperienceModel',
        
        function ($scope, SessionService, ExperienceModel) {

            var exp = this;

            var onFailureShowServerError = function (errorResponse) {
                exp.loading = false;
                exp.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            exp.serverError = false;
            exp.loading = true;
            
            exp.endDateSorter = function (expEntry) {
                
                if (expEntry.end_date) {
                    var theDate = new Date(expEntry.end_date);
                    return theDate.getTime();
                }
                return Infinity;
                
            };
            
            $scope.cachedExperiences = [];

            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                ExperienceModel.query({
                    resumeId: currRemuseId
                }, function (loadedExps) {
                    $scope.cachedExperiences = loadedExps;
                    exp.loading = false;
                }, onFailureShowServerError);
                    // error from ExperienceModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()

        }
        
    ]);
    
    return resmesExperience;
    
});
