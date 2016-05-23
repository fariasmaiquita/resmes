define('resmes', [
    
    'angular',
    'angular.animate',
    'angular.resource',
    'angular.sanitize',
    'angular.sortable',
    'angular.uiRouter',
    'angular.uiTinymce',
    'angular.satellizer',
    
    'filesaver',
    'ie10ViewportBugWorkaround',
    
    'tinymce',
    'tinymce.placeholder',
    
    'jquery',
    'jquery.ui',
    'jquery.easing',
    'jquery.mCustomScrollbar',
    
    'resmes.core',
    'resmes.welcome',
    'resmes.changelog',
    'resmes.legal',
    'resmes.drawer',
    'resmes.layouts',
    'resmes.typography',
    'resmes.general',
    'resmes.experience',
    'resmes.education',
    'resmes.skills',
    'resmes.additionals',
    'resmes.headings',
    'resmes.export'
    
], function (angular) {
    
    'use strict';
    
    var resmes = angular.module('resmes', [
        
        'ngAnimate',
        'ngResource',
        'ngSanitize',
        'ui.sortable',
        'ui.router',
        'ui.tinymce',
        'satellizer',
        
        'resmes.core',
        'resmes.welcome',
        'resmes.changelog',
        'resmes.legal',
        'resmes.drawer',
        'resmes.layouts',
        'resmes.typography',
        'resmes.general',
        'resmes.experience',
        'resmes.education',
        'resmes.skills',
        'resmes.additionals',
        'resmes.headings',
        'resmes.export'
        
    ]);
    
    resmes.run(['$log', '$state', function ($log, $state) {
        
        $log.info('Resm.es App is now running the show. Whoot whoot!');
        $state.go('resmes.home');
        
    }]);

    return resmes;
    
});
