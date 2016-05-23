define('resmes.core.services', ['angular'], function (angular) {
    
    'use strict';
    
    var resmesCoreServices = angular.module('resmes.core.services', []);
    
    resmesCoreServices.service('SessionService', [
        
        '$auth',
        '$http',
        '$q',
        
        function($auth, $http, $q) {

            var SessionService = this,
                restoredSession = false,
                currResumeId = null,
                resumesOpts = null;

            SessionService.getAuthUser = function () {
                
                if ($auth.isAuthenticated()) {
                    return $http.post(
                        location.href.split('#')[0] + 'auth/get?token=' +
                        $auth.getToken()
                    );;
                }
                
                return $q.when(null);
                
            };
            
            SessionService.wasSessionRestored = function () {
                return restoredSession;
            }
            
            SessionService.getResumesOpts = function () {
                if (resumesOpts) return $q.when(resumesOpts);
                
                return $http.get(
                    location.href.split('#')[0] + 'api/resumes/options'
                ).then(function (optsResponse) {
                    resumesOpts = optsResponse;
                    return resumesOpts;
                });
            };

            SessionService.getObjIndex = function (key, value, objArray) {
                for (var i=0; i < objArray.length; i++) {
                    if (objArray[i][key] == value) return i;
                }
                return -1;
            };

            SessionService.setAuthGuest = function () {
                return $http.post(
                    location.href.split('#')[0] + 'auth/guest'
                ).then(function (guestUser) {

                    $auth.setToken(guestUser.data.token);
                    currResumeId = guestUser.data.resume_id;
                    return currResumeId;

                }, function (error) {
                    console.log('Automated Guest Login Error', error);
                });
            }
            
            SessionService.getCurrResumeId = function () {

                if (currResumeId) return $q.when(currResumeId);

                var deferredCurrResumeId = $q.defer();
                
                if ($auth.isAuthenticated()) {
                    
                    $http.get(
                        
                        location.href.split('#')[0] +
                        'api/resumes?token=' + $auth.getToken()
                        
                    ).then(function(response) {
                        
                        var loadedResumes = response.data;
                        
                        currResumeId = loadedResumes[0].id;
                        restoredSession = true;
                        deferredCurrResumeId.resolve(currResumeId);
                        
                    }, function(errorResponse) {
                        
                        console.log('Error Retrieving Resume ID', errorResponse);
                        
                        if (errorResponse.data.error == 'user_not_found') {
                            SessionService.setAuthGuest().then(function () {
                                deferredCurrResumeId.resolve(currResumeId);
                            });
                        }
                    });
                    
                } else {
                    SessionService.setAuthGuest().then(function() {
                        deferredCurrResumeId.resolve(currResumeId);
                    });
                }
                
                return deferredCurrResumeId.promise;

            };
            
            SessionService.setCurrResumeId = function (resumeId) {
                if (resumeId) {
                    currResumeId = resumeId;
                }
            };
        }
    ]);
    
    return resmesCoreServices;
    
});
