<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

// Index Route

Route::get('/', function()
{
	return View::make('index');
});

// Auth Routes

Route::post('auth/guest', 'AuthController@guest');
Route::post('auth/facebook', 'AuthController@facebook');
Route::post('auth/get', 'AuthController@get');

// API Routes

Route::group(array('prefix' => 'api'), function()
{
    Route::get('layouts/{slug}/demo', 'LayoutDemoController@index');
    Route::get('layouts/{slug}/demo/render', 'LayoutDemoController@render');
    Route::get('layouts/{slug}/demo/stream', 'LayoutDemoController@stream');
    
    Route::get('resumes/{id}/export', 'ResumeExportController@index');
    Route::get('resumes/{id}/export/render', 'ResumeExportController@render');
    Route::get('resumes/{id}/export/stream', 'ResumeExportController@stream');
    
    Route::get('resumes/options', 'ResumeOptionsController@index');
    
    Route::resource('resumes', 'ResumeController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.typography', 'ResumeTypographyController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.general', 'ResumeGeneralController', 
        array('only' => array('index', 'store')));
    
    Route::resource('resumes.experience', 'ResumeExperienceController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.education', 'ResumeEducationController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.skills', 'ResumeSkillController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.additionals', 'ResumeAdditionalController', 
        array('except' => array('create', 'edit')));
    
    Route::resource('resumes.headings', 'ResumeHeadingController', 
        array('except' => array('create', 'edit')));
    
});