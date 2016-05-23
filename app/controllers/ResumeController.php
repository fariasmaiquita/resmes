<?php

class ResumeController extends \BaseController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->afterFilter('@updateTimestamps', ['only' => ['update']]);
    }
    
    public function index()
	{
        $authUser = self::getAuthUser();
        $userResumes = Resume::where('user_id', $authUser->id)
            ->orderBy('updated_at', 'desc')->get();
        
        if ($userResumes->count() == 0) {
            $newResume = new Resume;
            $newResume->user_id = $authUser->id;
            $newResume->save();
            $userResumes->push($newResume);
        }
        
        return Response::json($userResumes);
	}

    public function store()
	{
        $authUser = self::getAuthUser();
        
		$stored = Resume::create(array(
            'title' => Input::get('title'),
            'draft' => Input::get('draft'),
            'user_id' => $authUser->id
        ));
        
        if ($stored) {
            
            $placeholderGeneral = new General;
            $placeholderGeneral->full_name = 'Insert Full Name Here';
            $placeholderGeneral->headline = 'Insert Resume Headline Here';
            $placeholderGeneral->summary = 'Insert Summary Here (Optional)';
            $placeholderGeneral->phone = 'Insert Phone Number Here';
            $placeholderGeneral->email = 'Insert Email Here';
            $placeholderGeneral->resume_id = $stored->id;
            $placeholderGeneral->save();
            
            return Response::json($stored);
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

    public function show($id)
	{
        $authUser = self::getAuthUser();
		$userResume = Resume::where('user_id', $authUser->id)->find($id);
        
        if ($userResume) {
            return Response::json($userResume);
        }
        
        return Response::json('Resume Not Found', 404);
	}

    public function update($id)
	{
        $authUser = self::getAuthUser();
        
		$updated = Resume::where('user_id', $authUser->id)
            ->find($id)
            ->update(array(
                'title' => Input::get('title'),
                'draft' => Input::get('draft')
            ));
        
        if ($updated) {
            return Response::json(
                Resume::where('user_id', $authUser->id)->find($id)
            );
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

    public function destroy($id)
	{
        $authUser = self::getAuthUser();
        
        if (Resume::where('user_id', $authUser->id)->count() <= 1) {
            throw new UnderflowException('Error! User is expected to have at least one resume.');
        }
        
        $destroyed = Resume::where('user_id', $authUser->id)
            ->find($id)->delete();
        
        if ($destroyed) {
            
            return Response::json(
                Resume::where('user_id', $authUser->id)
                    ->orderBy('updated_at', 'desc')->first()
            );
        }
        
        return Response::json('Unknown Internal Server Error', 500);
	}

}
