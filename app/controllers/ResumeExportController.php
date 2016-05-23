<?php

class ResumeExportController extends AbstractExportController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
        $this->beforeFilter('@checkResumeValidity');
        $this->afterFilter('@updateTimestamps', ['except' => 'render']);
    }
    
    public function index($resumeId)
    {
        return View::make('export.preview');
    }
    
    public function render($resumeId)
    {
        return View::make('export.layouts.one')
            ->with('resumeData', $this->resumeData($resumeId))
            ->render();
    }
    
    public function stream($resumeId)
	{
        try {
            
            return PDF::loadView('export.layouts.one', array(
                'resumeData' => $this->resumeData($resumeId)
            ))->stream();
            
        } catch (OverflowException $e) {
            
            return Response::json($e->getMessage(), 501);
            
        } catch (Exception $e) {
        
            return Response::json($e->getMessage(), 500);
            
        }
    }
    
}
