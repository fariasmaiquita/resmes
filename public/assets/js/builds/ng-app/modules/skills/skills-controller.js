define('resmes.skills', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core',
    'resmes.skills.model',
    'resmes.skills.form'
    
], function (angular) {
    
    'use strict';
    
    var resmesSkills = angular.module('resmes.skills', [
        'resmes.core',
        'resmes.skills.model',
        'resmes.skills.form'
    ]);
    
    resmesSkills.config(['$stateProvider', function ($stateProvider) {
        
        $stateProvider.state('resmes.skills', {
            url: '/skills',
            views: {
                'subpanel@resmes' : {
                    templateUrl: 'assets/js/builds/ng-app/modules/skills/skills-view.html',
                    controller: 'SkillsController as skl'
                }
            }
        })
        
    }]);
    
    resmesSkills.controller('SkillsController', [
        
        '$scope',
        '$timeout',
        'SessionService',
        'SkillsModel',
        
        function ($scope, $timeout, SessionService, SkillsModel) {

            var skl = this,
                unsavedOrder = false,
                entriesReordered = false,
                reordoredId = null,
                reorderedFrom = null,
                reordoredTo = null;
            
            var saveOrderChanges = function () {
                
                skl.isSavingOrder = true;
                            
                SessionService.getCurrResumeId().then(function (currResumeId) {
                    SkillsModel.update({
                        resumeId: currResumeId,
                        skillId: reordoredId
                    }, {
                        reordered: true,
                        from: reorderedFrom,
                        to: reordoredTo,
                        //_token: authToken.data
                    }, function () {

                        skl.isSavingOrder = false;
                        $('.preview-canvas')[0].contentWindow.reloadRender();

                        if (unsavedOrder) {
                            unsavedOrder = false;
                            saveOrderChanges();
                        }
                    });
                });
                
            }
            
            var onFailureShowServerError = function (errorResponse) {
                skl.loading = false;
                skl.serverError = true;
                console.log('Error Details for Debugging', errorResponse);
            }
            
            skl.isSavingOrder = false;
            skl.serverError = false;
            skl.loading = true;
            
            skl.entriesOptions = {
                
                update: function (e, ui) {
                    entriesReordered = true;
                    reorderedFrom = ui.item.scope().$index;
                },
                
                stop: function (e, ui) {
                    
                    if (entriesReordered) {
                        
                        entriesReordered = false;
                        reordoredId = ui.item.scope().skill.id;
                        reordoredTo = ui.item.scope().$index;
                        
                        if (skl.isSavingOrder) {
                            unsavedOrder = true;
                        } else {
                            saveOrderChanges();
                        }
                    }
                }    
            };
            
            $scope.cachedSkills = [];
            
            SessionService.getCurrResumeId().then(function (currResumeId) {
                
                SkillsModel.query({
                    resumeId: currResumeId
                }, function (loadedSkls) {
                    $scope.cachedSkills = loadedSkls;
                    skl.loading = false;
                }, onFailureShowServerError);
                    // error from SkillsModel.query()
                
            }, onFailureShowServerError);
                // error from SessionService.getCurrResumeId()*/

        }
        
    ]);
    
    return resmesSkills;
    
});
