<html ng-app="resmes.preview" ng-controller="PreviewController as prv">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
        {{ HTML::script('assets/js/libs/jquery.js') }}
        {{ HTML::script('assets/js/libs/jquery-easing.js') }}
        {{ HTML::script('assets/js/libs/angular.js') }}
        {{ HTML::script('assets/js/libs/angular-animate.js') }}
        {{ HTML::script('assets/js/libs/angular-sanitize.js') }}
        <script>
            angular.module('resmes.preview', [
                'ngAnimate',
                'ngSanitize'
            ]).directive('onChange', ['$timeout', function ($timeout) {
                
                return {
                    scope: { updateVar: '=' },
                    link: function (scope, element, attrs) {
                        $(element).on('change', function() {
                            $timeout(function () {
                                scope.updateVar = $('#skeleton').height() > 1034;
                            }, 5000);
                        });
                    }
                }
                
            }]).animation('.opacity-animation', function () {
        
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

            }).controller('PreviewController', [
                
                '$http',
                '$sce',
                
                function ($http, $sce) {
                    
                    var prv = this;
                    
                    prv.pageCSS = null;
                    prv.pageHTML = null;
                    prv.loading = true;
                    
                    window.reloadRender = function () {
                        loadRender();
                    }
                    
                    function loadRender() {
                        
                        prv.loading = true;
                        
                        $http.get(
                            location.href.split('?')[0] +
                            '/render?token=' +
                            localStorage['satellizer_token'] 
                        ).then(function (renderResponse) {

                            var renderStr = renderResponse.data,

                                cssInit = renderStr.indexOf('<!-- pageCSS -->'),
                                cssEnd = renderStr.indexOf('<!-- /pageCSS -->'),
                                pageCSS = renderStr.substring(cssInit, cssEnd),

                                htmlInit = renderStr.indexOf('<!-- pageHTML -->'),
                                htmlEnd = renderStr.indexOf('<!-- /pageHTML -->'),
                                pageHTML = renderStr.substring(htmlInit, htmlEnd);

                            prv.pageCSS = $sce.trustAsHtml(pageCSS);
                            prv.pageHTML = $sce.trustAsHtml(pageHTML);
                            prv.loading = false;
                            
                            $('#page-preview').trigger('change');

                        }, function (errorResponse) {

                            console.log(errorResponse);
                            prv.loading = false;

                        });
                    }
                    
                    loadRender();

                }
            ]);
        </script>
        @foreach(TypographyFont::getFonts() as $font)
            @if($font['css_src'])
                {{ HTML::style($font['css_src']) }}
            @endif
        @endforeach
        <style ng-bind-html="prv.pageCSS"></style>
        <style>
            #overflow-warning {
                position: fixed;
                bottom: 0;
                border-top: 1px dashed #ccc;
                width: 705px;
                height: 43px;
                margin: 0 44px;
                text-align: center;
                font: 12px/43px sans-serif;
                vertical-align: middle;
            }
            #overflow-warning .text-highlight {
                background: #bbb;
                padding: 0 5px;
                display: inline-block;
                border-radius: 3px;
                margin-right: 5px;
                color: #fff;
                line-height: 18px;
            }
            #loading-wrapper {
                position: fixed;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background: rgba(255, 255, 255, 0.85);
            }
            #loading-alert {
                position: relative;
                top: 50%;
                margin-top: -22px;
                text-align: center;
                font-family: sans-serif;
            }
            #loading-alert * {
                vertical-align: middle;
            }
        </style>
    </head>
    <body>
        <div id="page-preview" ng-bind-html="prv.pageHTML" on-change update-var="prv.overflow"></div>
        <div id="overflow-warning" ng-if="prv.overflow">
            <span class="text-highlight">Warning</span>
            <span>For optimal results when exporting to PDF, your content must allow for a bit more bottom margin.</span>
        </div>
        <div id="loading-wrapper" class="opacity-animation" ng-if="prv.loading">
            <div id="loading-alert">
                <img src="{{ url('assets/img/loading_spin.svg') }}" alt="Resm.es Loading Spin">
                <span>Updadting Preview</span>
            </div>
        </div>
    </body>
</html>