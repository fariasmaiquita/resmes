<!DOCTYPE html>
<!--[if IE 8]>  <html class="ie lt-ie9" lang="en"><![endif]-->
<!--[if IE 9]>  <html class="ie lt-ie10" lang="en"><![endif]-->
<!--[if !IE]>   <!--><html lang="en"><!--<![endif]-->
<head>

	<!--
		Resm.es℠ App Version 0.1.0 (Alpha)
        E: folks@resm.es
        T: @resmesapp
	-->
	
	<!-- Basic Page Needs -->
    <meta charset="utf-8">
	<title>Resm.es</title>
    <meta property="og:title" content="Resm.es" />
	<meta name="description" content="State of the art resumes. Step up your resume game today. Lifetime FREE!!">
    <meta name="og:description" content="State of the art resumes. Step up your resume game today. Lifetime FREE!!" />
	<meta name="author" content="Resm.es℠">
    <meta property="og:image" content="{{ url('assets/img/resmes-preview.jpg') }}">
    <meta property="fb:app_id" content="888761944542977" />
    
	<!-- Mobile Specific Metas -->
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">

	<!-- CSS -->
	{{ HTML::style('assets/css/mCustomScrollbar.css') }}
    {{ HTML::style('assets/css/base.css?v=1.0') }}
	{{ HTML::style('assets/css/layout.css?v=1.0') }}
    
    <!-- Google Fonts -->
    {{ HTML::style('https://fonts.googleapis.com/css?family=Montserrat:400,700') }}
    
    <!--[if lt IE 9]>
        {{ HTML::script('http://html5shim.googlecode.com/svn/trunk/html5.js') }}
    <![endif]-->

	<!-- Favicons -->
	<link rel="shortcut icon" href="{{ url('assets/img/resmes_favicon.ico') }}">
	<link rel="apple-touch-icon" href="{{ url('assets/img/resmes_logo.png') }}">
    
    <!-- End of <HEAD> -->

</head>
<body>
    
    <div ui-view="core" class="opacity-animation"></div>
    
    <div class="app-preloader fixed-section">
        <div class="preloader-text">
            <img src="assets/img/loading_spin.svg" alt="Resm.es Loading Spin">
            <span>Loading application assets, please wait...</span>
        </div>
    </div>

    <div class="app-viewport-alert fixed-section">
        <span class="alert-text">
            Resm.es is not compatible with smaller sized browser windows...<br>
            Yet...!
        </span>
    </div>
    
    <!-- Scripts Loader -->
    {{ HTML::script('assets/js/libs/require.js', ['data-main' => 'assets/js/builds/loader.js']) }}

    <!-- End of <BODY> -->
    
</body>
</html>