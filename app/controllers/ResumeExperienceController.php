<?php

class ResumeExperienceController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(Experience::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
		$input_validator = Validator::make(
            Input::except('description', 'location', '_token'),
            Experience::validatorRules()
        );
        
        $input_validator->sometimes('start_date', 'max:' . Input::get('end_date'), function ($input)
        {
            return !is_null($input->end_date);
        });
        
        if ($input_validator->passes()) {
            
            $htmlSanitizer = new HTML_Sanitizer;
            $description = $htmlSanitizer->sanitize(Input::get('description'));
            if ($description == '<p><br data-mce-bogus="1"></p>') {
                $description = null;
            }
            
            $stored = Experience::create(array(
                'company' => Input::get('company'),
                'title' => Input::get('title'),
                'location' => Input::get('location'),
                'description' => $description,
                'start_date' => date('Y-m-d', Input::get('start_date')),
                'end_date' => Input::get('end_date') ? date('Y-m-d', Input::get('end_date')) : null,
                'resume_id' => $resumeId
            ));

            if ($stored) {
                return Response::json($stored);
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function show($resumeId, $experienceId)
	{
		$experience = Experience::where('resume_id', $resumeId)->find($experienceId);
        
        if ($experience) {
            return Response::json($experience);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $experienceId)
	{
        $input_validator = Validator::make(
            Input::except('description', 'location', '_token'),
            Experience::validatorRules()
        );
        
        $input_validator->sometimes('start_date', 'max:' . Input::get('end_date'), function ($input)
        {
            return !is_null($input->end_date);
        });
        
        if ($input_validator->passes()) {
            
            $htmlSanitizer = new HTML_Sanitizer;
            $description = $htmlSanitizer->sanitize(Input::get('description'));
            if ($description == '<p><br data-mce-bogus="1"></p>') {
                $description = null;
            }
            
            $updated = Experience::where('resume_id', $resumeId)
                ->find($experienceId)
                ->update(array(
                    'company' => Input::get('company'),
                    'title' => Input::get('title'),
                    'location' => Input::get('location'),
                    'description' => $description,
                    'start_date' => date('Y-m-d', Input::get('start_date')),
                    'end_date' => Input::get('end_date') ? date('Y-m-d', Input::get('end_date')) : null
                ));

            if ($updated) {
                return Response::json(
                    Experience::where('resume_id', $resumeId)->find($experienceId)
                );
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function destroy($resumeId, $experienceId)
	{
		$destroyed = Experience::where('resume_id', $resumeId)
            ->find($experienceId)->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
