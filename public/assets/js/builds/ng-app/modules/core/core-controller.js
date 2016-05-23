define('resmes.core', [
    
    'angular',
    'angular.uiRouter',
    
    'resmes.core.services',
    'resmes.core.directives',
    'resmes.core.animations'
    
], function (angular) {
    
    'use strict';
    
    var resmesCore = angular.module('resmes.core', [
        'resmes.core.services',
        'resmes.core.directives',
        'resmes.core.animations'
    ]);
    
    var resmesCoreScope = null;
    
    resmesCore.config([
        
        '$stateProvider',
        '$authProvider',
        '$httpProvider',
        
        function ($stateProvider, $authProvider, $httpProvider) {
        
            var appUrl = location.href.split('#')[0];
            
            $stateProvider.state('resmes', {
                abstract: true,
                views: {
                    'core@': {
                        templateUrl: 'assets/js/builds/ng-app/modules/core/core-view.html',
                        controller: 'CoreController as core'
                    }
                }
            }).state('resmes.home', { url: '/' });

            $authProvider.facebook({
                url: appUrl + 'auth/facebook',
                clientId: '888761944542977',
                redirectUri: appUrl,
                scope: ['email']
            });
            
            $httpProvider.interceptors.push(function () {
                return {
                    request: function (config) {
                        if (config.url == appUrl + 'auth/facebook' && resmesCoreScope) {
                            resmesCoreScope.loadingUser = {
                                message: 'Signing in, please wait...'
                            };
                        }
                        return config;
                    }
                }
            });
            
        }
        
    ]);
    
    resmesCore.controller('CoreController', [
        
        '$scope',
        '$state',
        '$auth',
        '$http',
        'SessionService',
        
        function ($scope, $state, $auth, $http, SessionService) {
            
            var core = this,
                currentDate = new Date(),
                mainStates = [
                    'welcome',
                    'changelog',
                    'privacy',
                    'terms',
                    'layouts',
                    'typography',
                    'general',
                    'experience',
                    'education',
                    'skills',
                    'additionals',
                    'headings',
                    'export'
                ];
            
            resmesCoreScope = $scope;
            
            $scope.$on('$viewContentLoaded', function (event) {
                
                if (!$state.is('resmes.drawer')) {
                
                    var activeMenu = $('.app-header .active').closest('.collapsable'),
                        inactiveMenu = $('.app-header .collapsable').not(activeMenu);

                    if (activeMenu.closest('nav.header-menu').is('.collapsed')) {
                        activeMenu.slideDown('fast', function () {
                            $(this).closest('nav.header-menu').removeClass('collapsed');
                        });
                    }

                    if (!$state.is('resmes.home')) {
                        inactiveMenu.slideUp('fast', function () {
                            $(this).closest('nav.header-menu').addClass('collapsed');
                        });
                    }
                    
                }
                
            });
            
            core.preloading = true;
            core.currentYear = currentDate.getFullYear();
            core.showPreviewHeader = false;
            core.previewUrl = '';
            core.notification = {
                enabled: false,
                message: null
            };
            
            $scope.previewTitle = '';
            $scope.loadingUser = null;
            $scope.userSignedIn = null;
            
            var getStateIndex = function () {
                var stateIndex = null;
                for (var i = 0; i < mainStates.length; i++) {
                    if ($state.current.name == 'resmes.' + mainStates[i]) {
                        stateIndex = i;
                        break;
                    }
                }
                return stateIndex;
            };
            
            $scope.prevSubpanel = function () {
                var stateIndex = getStateIndex();
                if (stateIndex !==  null && stateIndex > 0) {
                    $state.go('resmes.' + mainStates[stateIndex - 1]);
                }
            };
            
            $scope.nextSubpanel = function () {
                var stateIndex = getStateIndex();
                if (stateIndex !== null && stateIndex < mainStates.length - 1) {
                    $state.go('resmes.' + mainStates[stateIndex + 1]);
                }
            };
            
            $scope.setPreviewTitle = function (resumeObj) {
                if (resumeObj) {
                    $scope.previewTitle = resumeObj.title || 'Untitled Resume';
                    $scope.previewTitle += resumeObj.draft ? ' (Draft)' : '';
                }
            };
            
            $scope.setPreviewUrl = function (resumeId) {
                if (resumeId) {
                    core.previewUrl = location.href.split('#')[0] + 
                        'api/resumes/' + resumeId + '/export?token=' +
                        $auth.getToken();
                    $scope.previewTitle = '';
                    
                    $http.get(
                        location.href.split('#')[0] +
                        'api/resumes/' + resumeId +
                        '?token=' + $auth.getToken()
                    ).then(function (loadedResume) {
                        $scope.setPreviewTitle(loadedResume.data);
                    });
                    
                }
            };
            
            $scope.signIn = function () {
                
                return $auth.authenticate('facebook', {
                    token: $auth.getToken()
                }).then(function (authUser) {
                    
                    if (authUser.data.resume_id) {
                        SessionService.setCurrResumeId(authUser.data.resume_id);
                        $scope.setPreviewUrl(authUser.data.resume_id);
                    }
                    $scope.loadingUser = null;
                    $scope.userSignedIn = {
                        name: authUser.data.name
                    };
                    core.hideNotification();
                    
                }, function (error) { console.log('FB Login Error', error); });
                
            };
            
            core.signOut = function () {
                
                $scope.loadingUser = {
                    message: 'Signing out, please wait...'
                };
                SessionService.setAuthGuest().then(function (resumeId) {
                    $scope.userSignedIn = null;
                    $scope.loadingUser = null;
                    $scope.setPreviewUrl(resumeId);
                    $('.app-preview-section').mCustomScrollbar('scrollTo', 'top');
                    core.showNotification('Hey there! You are good to go, your account has been signed out. (Do not be a stranger)');
                });
                
            };
            
            core.showNotification = function (strMsg) {
                if (strMsg) {
                    core.notification.message = strMsg;
                    core.notification.enabled = true;
                }
            };
            
            core.hideNotification = function () {
                core.notification.enabled = false;
            }
            
            
            SessionService.getCurrResumeId().then(function (currRemuseId) {
            
                SessionService.getAuthUser().then(function (authUser) {
                    
                    core.showPreviewHeader = true;
                    
                    $('.app-preloader').animate({opacity: 0}, 'fast', function () {
                        $(this).remove();
                    });
                    
                    if (authUser.data.facebook) {
                        
                        $scope.userSignedIn = {
                            name: authUser.data.name
                        };
                        
                    } else if (!authUser.data.facebook &&
                               authUser.data.created_at != authUser.data.updated_at &&
                               SessionService.wasSessionRestored()) {
                        
                        core.showNotification('Hey there! We noticed that you could not complete your resume setup last time, so we restored your previous session.');
                        
                    } else {
                        
                        $state.go('resmes.welcome');
                        
                    }
                    
                    //console.log('Token generated:', $auth.getToken());
                    
                    $scope.setPreviewUrl(currRemuseId); 
                    
                });
                
            }); // ON ERROR MISSING //*/
            
            //console.log('$state.get()', $state.current);

        }
        
    ]);
    
    return resmesCore;
    
});
