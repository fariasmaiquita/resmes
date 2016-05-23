define('bootstrap', [
    
    'require',
    'angular',
    'resmes',
    
], function (require, angular) {
    
    'use strict';
    
    require(['domReady!'], function (doc) {
        
        if (angular.element('.ie.lt-ie10').html()) {
            require(['base64'], function () {
                angular.bootstrap(doc, ['resmes']);
            });
        } else {
            angular.bootstrap(doc, ['resmes']);
        }
        
    });
    
});
    