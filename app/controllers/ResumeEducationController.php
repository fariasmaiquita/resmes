<?php

class ResumeEducationController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(Education::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
		$input_validator = Validator::make(
            Input::except('description', '_token'),
            Education::validatorRules()
        );
        
        $input_validator->sometimes('start_year', 'max:' . Input::get('end_year'), function ($input)
        {
            return !is_null($input->end_year);
        });
        
        if ($input_validator->passes()) {
        
            $htmlSanitizer = new HTML_Sanitizer;
            $description = $htmlSanitizer->sanitize(Input::get('description'));
            if ($description == '<p><br data-mce-bogus="1"></p>') {
                $description = null;
            }
            
            $stored = Education::create(array(
                'school' => Input::get('school'),
                'degree' => Input::get('degree'),
                'course' => Input::get('course'),
                'description' => $description,
                'start_year' => date('Y-m-d', strtotime(Input::get('start_year') . '-01-01')),
                'end_year' => Input::get('end_year') ?
                    date('Y-m-d', strtotime(Input::get('end_year') . '-01-01')) :
                    null,
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

    public function show($resumeId, $educationId)
	{
		$education = Education::where('resume_id', $resumeId)->find($educationId);
        
        if ($education) {
            return Response::json($education);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $educationId)
	{
        $input_validator = Validator::make(
            Input::except('description', '_token'),
            Education::validatorRules()
        );
        
        $input_validator->sometimes('start_year', 'max:' . Input::get('end_year'), function ($input)
        {
            return !is_null($input->end_year);
        });
        
        if ($input_validator->passes()) {
            
            $htmlSanitizer = new HTML_Sanitizer;
            $description = $htmlSanitizer->sanitize(Input::get('description'));
            if ($description == '<p><br data-mce-bogus="1"></p>') {
                $description = null;
            }
            
            $updated = Education::where('resume_id', $resumeId)
                ->find($educationId)
                ->update(array(
                    'school' => Input::get('school'),
                    'degree' => Input::get('degree'),
                    'course' => Input::get('course'),
                    'description' => $description,
                    'start_year' => date('Y-m-d', strtotime(Input::get('start_year') . '-01-01')),
                    'end_year' => Input::get('end_year') ?
                        date('Y-m-d', strtotime(Input::get('end_year') . '-01-01')) :
                        null
                ));

            if ($updated) {
                return Response::json(
                    Education::where('resume_id', $resumeId)->find($educationId)
                );
            } else {
                return Response::json(array('validatorFailed' => true), 500);
            }
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function destroy($resumeId, $educationId)
	{
		$destroyed = Education::where('resume_id', $resumeId)
            ->find($educationId)->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
