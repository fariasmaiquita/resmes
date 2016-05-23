<?php

class ResumeHeadingController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(Heading::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
		$input_validator = Validator::make(
            Input::only('section', 'title'),
            Heading::validatorRules($resumeId, null)
        );
        
        if ($input_validator->passes()) {
        
            $stored = Heading::create(array(
                'section' => Input::get('section'),
                'title' => Input::get('title'),
                'subtitle' => Input::get('subtitle'),
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

    public function show($resumeId, $headingId)
	{
		$heading = Heading::where('resume_id', $resumeId)->find($headingId);
        
        if ($heading) {
            return Response::json($heading);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $headingId)
	{
        $input_validator = Validator::make(
            Input::only('section', 'title'),
            Heading::validatorRules($resumeId, $headingId)
        );
        
        if ($input_validator->passes()) {
            
            $updated = Heading::where('resume_id', $resumeId)
                ->find($headingId)
                ->update(array(
                    'section' => Input::get('section'),
                    'title' => Input::get('title'),
                    'subtitle' => Input::get('subtitle')
                ));

            if ($updated) {
                return Response::json(
                    Heading::where('resume_id', $resumeId)->find($headingId)
                );
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function destroy($resumeId, $headingId)
	{
		$destroyed = Heading::where('resume_id', $resumeId)
            ->find($headingId)->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
