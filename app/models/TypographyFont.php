<?php

class TypographyFont {
    
    private static $fonts = array(
        'Georgia' => array(
            'family' => 'Georgia',
            'serif' => true,
            'css_src' => null
        ),
        'Lato' => array(
            'family' => 'Lato',
            'serif' => false,
            'css_src' => 'https://fonts.googleapis.com/css?family=Lato:400,400italic,700,700italic'
        ),
        'Lora' => array(
            'family' => 'Lora',
            'serif' => true,
            'css_src' => 'https://fonts.googleapis.com/css?family=Lora:400,400italic,700,700italic'
        ),
        'Open Sans' => array(
            'family' => 'Open Sans',
            'serif' => false,
            'css_src' => 'https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700,700italic'
        ),
        'PT Sans' => array(
            'family' => 'PT Sans',
            'serif' => false,
            'css_src' => 'https://fonts.googleapis.com/css?family=PT+Sans:400,400italic,700,700italic'
        ),
        'PT Serif' => array(
            'family' => 'PT Serif',
            'serif' => true,
            'css_src' => 'https://fonts.googleapis.com/css?family=PT+Serif:400,400italic,700,700italic'
        ),
        'Roboto' => array(
            'family' => 'Roboto',
            'serif' => false,
            'css_src' => 'https://fonts.googleapis.com/css?family=Roboto:400,400italic,700,700italic'
        )
    );
    
    private static $sizes = array(
        '0.9em' => array('value' => '0.9em', 'label' => 'Small'),
        '0.95em' => array('value' => '0.95em', 'label' => 'Medium'),
        '1em' => array('value' => '1em', 'label' => 'Large')
    );
    
    private static function arrayToStr($array, $key, $separator)
    {
        $strArray = '';
        foreach($array as $item) {
            $strArray .= $item[$key] . $separator;
        }
        return substr($strArray, 0, strlen($strArray) - 1);
    }
    
    public static function getFonts()
    {
        return self::$fonts;
    }
    
    public static function getStrFamilies()
    {
        return self::arrayToStr(self::$fonts, 'family', ',');
    }
    
    public static function getSizes()
    {
        return self::$sizes;
    }
    
    public static function getStrSizes()
    {
        return self::arrayToStr(self::$sizes, 'value', ',');
    }
    
}
