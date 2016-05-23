<?php

class LayoutDemoController extends AbstractExportController {

	public function __construct()
    {
        $this->beforeFilter('jwt-auth');
    }
    
    public function index($slug)
    {
        return View::make('export.preview')
            ->with('demoPreview', true);
    }
    
    public function render($slug)
    {
        $demoResumeId = Layout::getDemoResumeId($slug);
        
        return View::make('export.layouts.one')
            ->with('resumeData', $this->resumeData($demoResumeId))
            ->render();
    }
    
    public function stream($slug)
	{
        $demoResumeId = Layout::getDemoResumeId($slug);
        
        try {
            
            return PDF::loadView('export.layouts.one', array(
                'resumeData' => $this->resumeData($demoResumeId)
            ))->stream();
            
        } catch (OverflowException $e) {
            
            return Response::json($e->getMessage(), 501);
            
        } catch (Exception $e) {
        
            return Response::json($e->getMessage(), 500);
            
        }
    }
    
}
