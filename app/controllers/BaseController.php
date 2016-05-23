<?php

class BaseController extends Controller {

	/**
	 * Setup the layout used by the controller.
	 *
	 * @return void
	 */
	protected function setupLayout()
	{
		if ( ! is_null($this->layout))
		{
			$this->layout = View::make($this->layout);
		}
	}
    
    protected function getAuthUser()
    {
        try {

            if (! $authUser = JWTAuth::parseToken()->toUser())
            {
                App::abort(404, 'User Not Found');
            }

        } catch (Tymon\JWTAuth\Exceptions\TokenExpiredException $e) {

            App::abort($e->getStatusCode(), 'Token Expired');

        } catch (Tymon\JWTAuth\Exceptions\TokenInvalidException $e) {

            App::abort($e->getStatusCode(), 'Token Invalid');

        } catch (Tymon\JWTAuth\Exceptions\JWTException $e) {

            App::abort($e->getStatusCode(), 'Token Absent');

        }

        return $authUser;
    }
    
    public function checkResumeValidity($route)
    {
        $authUser = self::getAuthUser();
        $resume = Resume::findOrFail(array_values($route->parameters())[0]);
        if ($authUser->id != $resume->user_id)
        {
            App::abort(400, 'Resume ID Invalid');
        }
    }
    
    public function updateTimestamps($route)
    {
        $authUser = self::getAuthUser();
        $resume = Resume::findOrFail(array_values($route->parameters())[0]);
        
        if ((is_null($authUser->facebook) && $route->uri() != 'api/resumes/{id}/export') ||
           !is_null($authUser->facebook)) {
            
            $authUser->touch();
            $resume->touch();
            
        }
        
    }

}
