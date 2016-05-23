<?php

class AuthController extends \BaseController {

    public function __construct()
    {
        $this->beforeFilter('jwt-auth', ['only' => ['get']]);
    }
    
    public function guest()
    {
        $goneGuests = User::where('facebook', null)
            ->where('updated_at', '<', date('Y-m-d H:i:s', time() - 24*60*60))
            ->forceDelete();
        
        $guestUser = new User;
        $guestUser->save();
        
        $guestResume = new Resume;
        $guestResume->user_id = $guestUser->id;
        $guestResume->save();
        
        $placeholderGeneral = new General;
        $placeholderGeneral->full_name = 'Insert Full Name Here';
        $placeholderGeneral->headline = 'Insert Headline Here';
        $placeholderGeneral->summary = 'Insert Summary Here (Optional)';
        $placeholderGeneral->phone = 'Insert Phone Number Here';
        $placeholderGeneral->email = 'Insert Email Here';
        $placeholderGeneral->resume_id = $guestResume->id;
        $placeholderGeneral->save();
        
        return Response::json([
            'token' => JWTAuth::fromUser($guestUser),
            'resume_id' => $guestResume->id
        ]);
        
    }
    
    public function facebook()
    {
        $accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
        $graphApiUrl = 'https://graph.facebook.com/v2.3/me?fields=email,name,id';

        $params = [
            'code' => Input::get('code'),
            'client_id' => Input::get('clientId'),
            'redirect_uri' => Input::get('redirectUri'),
            'client_secret' => Config::get('app.facebook_secret')
        ];

        $client = new GuzzleHttp\Client();
        
        // QUICK SSL ERROR FIX JUST FOR TESTING // REMOVE LATER
        $client->setDefaultOption('verify', false); 

        // Step 1. Exchange authorization code for access token.
        $accessToken = $client->get($accessTokenUrl, ['query' => $params])->json();

        // Step 2. Retrieve profile information about the current user.
        $profile = $client->get($graphApiUrl, ['query' => $accessToken])->json();
        
        // Step 3. Save current resume (if any), return new jwt_token and resume_id
        
        try {
            
            $currUser = User::where('facebook', $profile['id'])->firstOrFail();
            
        } catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            
            $currUser = User::firstOrCreate(['facebook' => $profile['id']]);
            $currUser->name = $profile['name'];
            $currUser->email = $profile['email'];
            $currUser->save();
            
        }
        
        $prevUser = JWTAuth::toUser(Input::get('token'));
        
        if (is_null($prevUser->facebook)) {
            
            try {
                
                $lastUpdatedResume = Resume::where('user_id', $currUser->id)
                    ->orderBy('updated_at', 'desc')->firstOrFail();
                
            } catch(\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
                
                $lastUpdatedResume = null;
                
            }
            
            if ($prevUser->created_at != $prevUser->updated_at ||
                is_null($lastUpdatedResume)) {
                
                $prevResume = Resume::where('user_id', $prevUser->id)->first();
                $prevResume->user_id = $currUser->id;
                $prevResume->save();
                
            }
            
        } else {
            
            $lastUpdatedResume = Resume::orderBy('updated_at', 'desc')
                ->firstOrCreate(['user_id' => $currUser->id]);
            
        }
        
        return Response::json([
            'token' => JWTAuth::fromUser($currUser),
            'name' => $profile['name'],
            'resume_id' => isset($prevResume) ? null : $lastUpdatedResume->id
        ]);
    }
    
    public function get()
    {
        return Response::json(self::getAuthUser());
    }
    
}
