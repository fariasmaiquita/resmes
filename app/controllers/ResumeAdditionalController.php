<?php

class ResumeAdditionalController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(Additional::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
		$input_validator = Validator::make(
            Input::only('type', 'content', 'author'),
            Additional::validatorRules($resumeId, null)
        );
        
        if ($input_validator->passes()) {
        
            $htmlSanitizer = new HTML_Sanitizer;
            $content = $htmlSanitizer->sanitize(Input::get('content'));
            if ($content == '<p><br data-mce-bogus="1"></p>') {
                $content = null;
            }
            
            $stored = Additional::create(array(
                'type' => Input::get('type'),
                'content' => $content,
                'author' => Input::get('author'),
                'author_company' => Input::get('author_company'),
                'author_position' => Input::get('author_position'),
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

    public function show($resumeId, $additionalId)
	{
		$additional = Additional::where('resume_id', $resumeId)->find($additionalId);
        
        if ($additional) {
            return Response::json($additional);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $additionalId)
	{
        $input_validator = Validator::make(
            Input::only('type', 'content', 'author'),
            Additional::validatorRules($resumeId, $additionalId)
        );
        
        if ($input_validator->passes()) {
            
            $htmlSanitizer = new HTML_Sanitizer;
            $content = $htmlSanitizer->sanitize(Input::get('content'));
            if ($content == '<p><br data-mce-bogus="1"></p>') {
                $content = null;
            }
            
            $updated = Additional::where('resume_id', $resumeId)
                ->find($additionalId)
                ->update(array(
                    'content' => $content,
                    'author' => Input::get('author'),
                    'author_company' => Input::get('author_company'),
                    'author_position' => Input::get('author_position')
                ));

            if ($updated) {
                return Response::json(
                    Additional::where('resume_id', $resumeId)->find($additionalId)
                );
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function destroy($resumeId, $additionalId)
	{
		$destroyed = Additional::where('resume_id', $resumeId)
            ->find($additionalId)->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
