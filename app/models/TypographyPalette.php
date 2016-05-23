<?php

class TypographyPalette {
    
    private static $palettes = array(
        '#e74c3c' => array('color' => '#e74c3c', 'label' => 'Alizarin'),
        '#c0392b' => array('color' => '#c0392b', 'label' => 'Pomergranate'),
        '#e67e22' => array('color' => '#e67e22', 'label' => 'Carrot'),
        '#d35400' => array('color' => '#d35400', 'label' => 'Pumpkin'),
        '#f1c40f' => array('color' => '#f1c40f', 'label' => 'Sun Flower'),
        '#f39c12' => array('color' => '#f39c12', 'label' => 'Orange'),
        '#1abc9c' => array('color' => '#1abc9c', 'label' => 'Turquoise'),
        '#16a085' => array('color' => '#16a085', 'label' => 'Green Sea'),
        '#2ecc71' => array('color' => '#2ecc71', 'label' => 'Emerald'),
        '#27ae60' => array('color' => '#27ae60', 'label' => 'Nephritis'),
        '#3498db' => array('color' => '#3498db', 'label' => 'Peter River'),
        '#2980b9' => array('color' => '#2980b9', 'label' => 'Belize Hole'),
        '#9b59b6' => array('color' => '#9b59b6', 'label' => 'Amethyst'),
        '#8e44ad' => array('color' => '#8e44ad', 'label' => 'Wisteria'),
        '#34495e' => array('color' => '#34495e', 'label' => 'Wet Asphalt'),
        '#2c3e50' => array('color' => '#2c3e50', 'label' => 'Midnight Blue')
    );
    
    public static function getPalettes()
    {
        return self::$palettes;
    }
    
    public static function getStrPalettes()
    {
        $strPalettes = '';
        foreach(self::$palettes as $palette) {
            $strPalettes .= $palette['color'] . ',';
        }
        return substr($strPalettes, 0, strlen($strPalettes) - 1);
    }
    
}
