<?php

class ResumeTypographyController extends \BaseController {

	private function inputValidatorPasses($formInput, $resumeId, $typographyId)
    {
        $input_validator = Validator::make(
            $formInput,
            Typography::validatorRules($resumeId, $typographyId)
        );
        
        $input_validator->sometimes(
            'font_family',
            'required|in:' . TypographyFont::getStrFamilies(),
            function ($input) {
                return $input->section != 'size' && $input->section != 'color';
            }
        );
        
        $input_validator->sometimes(
            'font_size',
            'required|in:' . TypographyFont::getStrSizes(),
            function ($input) {
                return $input->section == 'size';
            }
        );
        
        $input_validator->sometimes(
            'palette_color',
            'required|in:' . TypographyPalette::getStrPalettes(),
            function ($input) {
                return $input->section == 'color';
            }
        );
        
        return $input_validator->passes();
    }
    
    public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(Typography::where('resume_id', $resumeId)->get());
	}

    public function store($resumeId)
	{
        if ($this->inputValidatorPasses(Input::except('_token'), $resumeId, null)) {
            
            $stored = Typography::create(array(
                'section' => Input::get('section'),
                'font_family' => Input::get('font_family'),
                'font_size' => Input::get('font_size'),
                'palette_color' => Input::get('palette_color'),
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

    public function show($resumeId, $typographyId)
	{
		$typography = Typography::where('resume_id', $resumeId)->find($typographyId);
        
        if ($typography) {
            return Response::json($typography);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $typographyId)
	{
        if ($this->inputValidatorPasses(Input::except('_token'), $resumeId, $typographyId)) {
            
            $updated = Typography::where('resume_id', $resumeId)
                ->find($typographyId)
                ->update(array(
                    'section' => Input::get('section'),
                    'font_family' => Input::get('font_family'),
                    'font_size' => Input::get('font_size'),
                    'palette_color' => Input::get('palette_color')
                ));

            if ($updated) {
                return Response::json(
                    Typography::where('resume_id', $resumeId)->find($typographyId)
                );
            }
            
        } else {
            return Response::json(array('validatorFailed' => true), 500);
        }
        
        return Response::json(array('validatorFailed' => false), 500);
	}

    public function destroy($resumeId, $typographyId)
	{
		$destroyed = Typography::where('resume_id', $resumeId)
            ->find($typographyId)->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
