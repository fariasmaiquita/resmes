<?php

class ResumeSkillController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => ['index', 'show']]);
    }
    
    public function index($resumeId)
	{
		return Response::json(
            Skill::where('resume_id', $resumeId)->orderBy('listing_index')->get()
        );
	}

    public function store($resumeId)
	{
		$input_validator = Validator::make(
            Input::only('expertise', 'order_index'),
            Skill::validatorRules()
        );
        
        if ($input_validator->passes()) {
        
            $htmlSanitizer = new HTML_Sanitizer;
            $details = $htmlSanitizer->sanitize(Input::get('details'));
            if ($details == '<p><br data-mce-bogus="1"></p>') {
                $details = null;
            }
            
            $stored = Skill::create(array(
                'expertise' => Input::get('expertise'),
                'details' => $details,
                'listing_index' => Skill::where('resume_id', $resumeId)->count(),
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

    public function show($resumeId, $skillId)
	{
		$skill = Skill::where('resume_id', $resumeId)->find($skillId);
        
        if ($skill) {
            return Response::json($skill);
        }
        
        return Response::json('Entry Not Found', 404);
	}

    public function update($resumeId, $skillId)
	{
        
        if (is_null(Input::get('reordered'))) {
            
            // UPDATE ENTRY FIELDS //
            
            $input_validator = Validator::make(
                Input::only('expertise'),
                Skill::validatorRules()
            );

            if ($input_validator->passes()) {

                $htmlSanitizer = new HTML_Sanitizer;
                $details = $htmlSanitizer->sanitize(Input::get('details'));
                if ($details == '<p><br data-mce-bogus="1"></p>') {
                    $details = null;
                }
                
                $updated = Skill::where('resume_id', $resumeId)
                    ->find($skillId)
                    ->update(array(
                        'expertise' => Input::get('expertise'),
                        'details' => $details
                    ));

                if ($updated) {
                    return Response::json(
                        Skill::where('resume_id', $resumeId)->find($skillId)
                    );
                }

            } else {
                return Response::json(array('validatorFailed' => true), 500);
            }

            return Response::json(array('validatorFailed' => false), 500);
            
        } else {
        
            // UPDATE ENTRIES ORDER //
            
            $from_index = Input::get('from');
            $to_index = Input::get('to');
            
            if ($from_index > $to_index) {
            
                Skill::where('resume_id', $resumeId)
                    ->where('listing_index', '<', $from_index)
                    ->where('listing_index', '>=', $to_index)
                    ->increment('listing_index');
                
            } else {
                
                Skill::where('resume_id', $resumeId)
                    ->where('listing_index', '>', $from_index)
                    ->where('listing_index', '<=', $to_index)
                    ->decrement('listing_index');
                
            }
                
            $movedEntry = Skill::where('resume_id', $resumeId)
                ->find($skillId)
                ->update(array('listing_index' => $to_index));
            
            return Response::json($movedEntry);
            
        }
        
        
        
	}

    public function destroy($resumeId, $skillId)
	{
		$skill = Skill::where('resume_id', $resumeId)->find($skillId);
        
        Skill::where('resume_id', $resumeId)
            ->where('listing_index', '>', $skill->listing_index)
            ->decrement('listing_index');
        
        $destroyed = $skill->delete();
        
        if ($destroyed) {
            return Response::json($destroyed);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
