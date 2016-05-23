define('resmes.core.animations', [
    
    'angular',
    'jquery',
    'jquery.easing'
    
], function (angular, $) {
    
    'use strict';
    
    var resmesCoreAnimations = angular.module('resmes.core.animations', []);
    
    resmesCoreAnimations.animation('.opacity-animation', function () {
        
        return {
            enter: function (element, done) {
                $(element)
                    .css({opacity: 0})
                    .animate({opacity: 1}, 'fast', done);
            },
            leave: function (element, done) {
                $(element)
                    .css({opacity: 1})
                    .animate({opacity: 0}, 'fast', done);
            }
        }
        
    }).animation('.slide-animation', function () {
        
        return {
            enter: function (element, done) {
                $(element)
                    .css({display: 'none'})
                    .slideDown('fast', done);
            },
            leave: function (element, done) {
                $(element)
                    .css({display: 'block'})
                    .slideUp('fast', done);
            }
        }
        
    });
    
    return resmesCoreAnimations;
    
});
