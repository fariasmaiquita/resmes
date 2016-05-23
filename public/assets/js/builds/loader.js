require.config({
    
    baseUrl: 'assets/js',
    
    paths: {
        
        // Libraries
        
        'domReady': 'libs/domReady',
        'filesaver': 'libs/filesaver',
        'base64': 'libs/base64',
        'ie10ViewportBugWorkaround': 'libs/ie10-viewport-bug-workaround',
        
        'tinymce': 'libs/tinymce/tinymce.min',
        'tinymce.placeholder': 'libs/tinymce-placeholder',
        
        'jquery': 'libs/jquery',
        'jquery.ui': 'libs/jquery-ui',
        'jquery.easing': 'libs/jquery-easing',
        'jquery.mCustomScrollbar': 'libs/jquery-mCustomScrollbar',
        
        'angular': 'libs/angular',
        'angular.animate': 'libs/angular-animate',
        'angular.resource': 'libs/angular-resource',
        'angular.sanitize': 'libs/angular-sanitize',
        'angular.sortable': 'libs/angular-sortable',
        'angular.uiRouter': 'libs/angular-ui-router',
        'angular.uiTinymce': 'libs/angular-ui-tinymce',
        'angular.satellizer': 'libs/angular-satellizer',
        
        
        // Builds
        
        'bootstrap': 'builds/ng-app/app-bootstrap',
        'resmes': 'builds/ng-app/app',
        
        'resmes.core': 'builds/ng-app/modules/core/core-controller',
        'resmes.core.services': 'builds/ng-app/modules/core/core-services',
        'resmes.core.directives': 'builds/ng-app/modules/core/core-directives',
        'resmes.core.animations': 'builds/ng-app/modules/core/core-animations',
        
        'resmes.welcome': 'builds/ng-app/modules/welcome/welcome-controller',
        
        'resmes.changelog': 'builds/ng-app/modules/changelog/changelog-controller',
        
        'resmes.legal': 'builds/ng-app/modules/legal/legal-controller',
        
        'resmes.drawer': 'builds/ng-app/modules/drawer/drawer-controller',
        'resmes.drawer.form': 'builds/ng-app/modules/drawer/form/drawer-form-controller',
        
        'resmes.layouts': 'builds/ng-app/modules/layouts/layouts-controller',
        'resmes.layouts.demo': 'builds/ng-app/modules/layouts/demo/layouts-demo-controller',
        
        'resmes.typography': 'builds/ng-app/modules/typography/typography-controller',
        'resmes.typography.model': 'builds/ng-app/modules/typography/typography-model',
        'resmes.typography.form': 'builds/ng-app/modules/typography/form/typography-form-controller',
        
        'resmes.general': 'builds/ng-app/modules/general/general-controller',
        'resmes.general.model': 'builds/ng-app/modules/general/general-model',
        'resmes.general.form': 'builds/ng-app/modules/general/form/general-form-controller',
        
        'resmes.experience': 'builds/ng-app/modules/experience/experience-controller',
        'resmes.experience.model': 'builds/ng-app/modules/experience/experience-model',
        'resmes.experience.form': 'builds/ng-app/modules/experience/form/experience-form-controller',
        
        'resmes.education': 'builds/ng-app/modules/education/education-controller',
        'resmes.education.model': 'builds/ng-app/modules/education/education-model',
        'resmes.education.form': 'builds/ng-app/modules/education/form/education-form-controller',
        
        'resmes.skills': 'builds/ng-app/modules/skills/skills-controller',
        'resmes.skills.model': 'builds/ng-app/modules/skills/skills-model',
        'resmes.skills.form': 'builds/ng-app/modules/skills/form/skills-form-controller',
        
        'resmes.additionals': 'builds/ng-app/modules/additionals/additionals-controller',
        'resmes.additionals.model': 'builds/ng-app/modules/additionals/additionals-model',
        'resmes.additionals.form': 'builds/ng-app/modules/additionals/form/additionals-form-controller',
        
        'resmes.headings': 'builds/ng-app/modules/headings/headings-controller',
        'resmes.headings.model': 'builds/ng-app/modules/headings/headings-model',
        'resmes.headings.form': 'builds/ng-app/modules/headings/form/headings-form-controller',
        
        'resmes.export': 'builds/ng-app/modules/export/export-controller'
        
    },
    
    shim: {
        
        'tinymce.placeholder': { deps: ['tinymce'] },
        
        'jquery': { exports: '$' },
        'jquery.ui': { deps: ['jquery'] },
        'jquery.easing': { deps: ['jquery'] },
        'jquery.mCustomScrollbar': { deps: ['jquery'] },
        
        'angular': { exports: 'angular', deps: ['jquery'] },
        'angular.animate': { deps: ['angular'] },
        'angular.resource': { deps: ['angular'] },
        'angular.sanitize': { deps: ['angular'] },
        'angular.sortable': { deps: ['angular', 'jquery', 'jquery.ui'] },
        'angular.uiRouter': { deps: ['angular'] },
        'angular.uiTinymce': { deps: ['angular', 'tinymce', 'tinymce.placeholder'] },
        'angular.satellizer': { deps: ['angular'] },
        
    },
    
    deps: ['bootstrap']
    
});
