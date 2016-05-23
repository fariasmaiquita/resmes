<?php

class Layout {
    
    private static $layouts = array(
        'one' => array(
            'slug' => 'one',
            'name' => 'Layout One',
            'description' => 'Single page template, two columns, minimal, perfect for creatives.',
            'demo_resume_id' => 56,
        )
    );
    
    public static function getLayouts()
    {
        $layoutInfo = array_values(self::$layouts);
        for($i = 0; $i < count($layoutInfo); $i++)
        {
            array_pop($layoutInfo[$i]);
        }
        return $layoutInfo;
    }
    
    public static function getDemoResumeId($slug)
    {
        if (array_key_exists($slug, self::$layouts))
        {
            return self::$layouts[$slug]['demo_resume_id'];
        }
        
        App::abort(400, 'Layout Demo Invalid');
        
    }
    
}
