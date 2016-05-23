<?php

class ResumeGeneralController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => 'index']);
    }
    
    public function index($resumeId)
	{
		return Response::json(General::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
		$profileEntry = Input::get('profileEntry');
        
        if ($profileEntry) {
            $input_validator = Validator::make(
                Input::only('full_name'),
                General::validatorRules($profileEntry)
            );
        } else {
            $input_validator = Validator::make(
                Input::only('phone', 'email'),
                General::validatorRules($profileEntry)
            );
        }
        
        if ($input_validator->passes()) {
        
            $general = General::firstOrCreate(array('resume_id' => $resumeId));
            
            if ($profileEntry) {
                
                $htmlSanitizer = new HTML_Sanitizer;
                $summary = $htmlSanitizer->sanitize(Input::get('summary'));
                if ($summary == '<p><br data-mce-bogus="1"></p>') {
                    $summary = null;
                }
                
                $general->full_name = Input::get('full_name');
                $general->headline = Input::get('headline');
                $general->summary = $summary;
                
            } else {
                
                $general->location = Input::get('location');
                $general->phone = Input::get('phone');
                $general->email = Input::get('email');
                $general->website = Input::get('website');
                
            }
            
            $general->save();

            if ($general) {
                return Response::json($general);
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

}
