define('resmes.education', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.education.model',
    'resmes.education.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesEducation = angular.module('resmes.education', [
        'resmes.core',
        'resmes.education.model',
        'resmes.education.form'
    ]);
    
    resmesEducation.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.education', {
            url: '/education',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/education/education-view.html',
                    controller: 'EducationController as edu'
                }
            }
        })
        
    }]);
    
    resmesEducation.controller('EducationController', [
        
        '$scope',
        'SessionService',
        'EducationModel',
        
        function ($scope, SessionService, EducationModel) {

            var edu = this;

            var onFailureShowServerError = function (errorResponse) {
                edu.loading = false;
                edu.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            edu.serverError = false;
            edu.loading = true;
            
            edu.endYearSorter = function (eduEntry) {
                
                if (eduEntry.end_year) {
                    var theYear = new Date(eduEntry.end_year);
                    return theYear.getTime();
                }
                return Infinity;
                
            };
            
            edu.isExpectedGraduationYear = function (eduEntry) {
                
                if (eduEntry.end_year) {
                    var theYear = new Date(eduEntry.end_year),
                        currYear = new Date();
                    return theYear.getTime() > currYear.getTime;
                }
                return false;
                
            }
            
            $scope.cachedEducations = [];

            SessionService.getCurrResumeId().then(function (currRemuseId) {
                
                EducationModel.query({
                    resumeId: currRemuseId
                }, function (loadedEdus) {
                    $scope.cachedEducations = loadedEdus;
                    edu.loading = false;
                }, onFailureShowServerError);
                    // error from EducationModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()

        }
        
    ]);
    
    return resmesEducation;
    
});
