define('resmes.core.directives', [
    
    'angular',
    'jquery',
    'jquery.easing',
    'jquery.mCustomScrollbar'
    
], function (angular, $) {
    
    'use strict';

    var resmesCoreDirectives = angular.module('resmes.core.directives', []);
    
    
    // JQUERY ENABLED BEHAVIOURS //
    
    resmesCoreDirectives.directive('customScrollbar', function () {
        
        return function (scope, element, attrs) {
            $(element).mCustomScrollbar({
                theme: attrs.customScrollbar
            });
        }

    }).directive('togglableNav', function () {

        return function (scope, element) {
            var thisCollapsable = $(element).find('.collapsable'),
                otherCollapsable = $(element).parent().find('.collapsable').not(thisCollapsable);
            $(element).find('.toggle-menu').click(function () {
                if ($(element).is('.collapsed')) {
                    otherCollapsable.slideUp('fast', function () {
                        $(this).parent().addClass('collapsed');
                    });
                    thisCollapsable.slideDown('fast', function () {
                        $(element).removeClass('collapsed');
                    });
                } else {
                    thisCollapsable.slideUp('fast', function () {
                        $(element).addClass('collapsed');
                    });
                }
            });
        }

    }).directive('preloadImg', function () {
        
        return function (scope, element) {
            $(element).css({opacity: 0}).load(function () {
                $(this).animate({opacity: 1}, 'fast');
            });
        }

    });
    
    
    // CUSTOM FORM VALIDATORS //
    
    resmesCoreDirectives.directive('yMDateFormat', function () {
        
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function(inputValue) {
                    var date = inputValue ? inputValue : '';
                    if (date.length == 0) {
                        ctrl.$setValidity('format', true);
                    } else {
                        var dateParts = date.split('-');
                        if (dateParts.length == 2) {
                            var year = parseInt(dateParts[0], 10),
                                month = parseInt(dateParts[1], 10),
                                day = 1,
                                dateObj = new Date(year, month - 1, day);
                            if (dateObj.getFullYear() == year &&
                                dateObj.getMonth() + 1 == month &&
                                dateObj.getDate() == day) {
                                ctrl.$setValidity('format', true);
                            } else {
                                ctrl.$setValidity('format', false);
                            }
                        } else {
                            ctrl.$setValidity('format', false);
                        }
                    }
                });
            }
        }

    }).directive('yyyyDateFormat', function () {
        
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function(inputValue) {
                    if (inputValue) {
                        var year = parseInt(inputValue, 10);
                        if (year >= 1970 && year <= 2038) {
                            ctrl.$setValidity('format', true);
                        } else {
                            ctrl.$setValidity('format', false);
                        }
                    } else {
                        ctrl.$setValidity('format', true);
                    }
                });
            }
        }
        
    }).directive('maxDate', function () {
        
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function(inputValue) {
                    if (inputValue) {
                        var thisDate = new Date(inputValue).getTime(),
                            laterDate = attrs.maxDate ?
                                new Date(attrs.maxDate).getTime() : 
                                new Date().getTime();
                        
                        if (thisDate > laterDate) {
                            ctrl.$setValidity('interval', false);
                        } else {
                            ctrl.$setValidity('interval', true);
                        }
                    } else {
                        ctrl.$setValidity('interval', true);
                    }
                });
            }
        }
        
    }).directive('maxYear', function () {
        
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ctrl) {
                scope.$watch(attrs.ngModel, function(inputValue) {
                    if (inputValue) {
                        var thisYear = parseInt(inputValue, 10),
                            laterYear = attrs.maxYear ?
                                parseInt(attrs.maxYear, 10) : 
                                new Date().getFullYear();
                        
                        if (thisYear > laterYear) {
                            ctrl.$setValidity('interval', false);
                        } else {
                            ctrl.$setValidity('interval', true);
                        }
                    } else {
                        ctrl.$setValidity('interval', true);
                    }
                });
            }
        }
        
    });
    
    return resmesCoreDirectives;
    
});
