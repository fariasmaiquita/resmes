<?php

class Changelog {
    
    private static $entries = array(
        array(
            'version' => '0.1.0',
            'release_date' => '2015-10-19',
            'changes' => array(
                '1 Layout Template',
                '7 Font Families',
                '16 Theme Colors',
                'Facebook Sign In',
                'Ability to Manage Multiple Resumes'
            )
        )
    );
    
    public static function getEntries()
    {
        return self::$entries;
    }
    
}
