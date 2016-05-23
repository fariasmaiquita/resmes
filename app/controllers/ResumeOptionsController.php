<?php

class ResumeOptionsController extends \BaseController {

    public function index()
    {
        return Response::json(array(
            
            'changelog' => Changelog::getEntries(),
            
            'legal' => array(
                'privacy' => Legal::getPrivacyPolicy(),
                'terms' => Legal::getTermsAndConditions()
            ),
            
            'layouts' => Layout::getLayouts(),
            'fonts' => TypographyFont::getFonts(),
            'sizes' => TypographyFont::getSizes(),
            'palettes' => TypographyPalette::getPalettes(),
            'defaults' => array(
                'layout' => array_values(Layout::getLayouts())[0],
                'font' => array_values(TypographyFont::getFonts())[3],
                'size' => array_values(TypographyFont::getSizes())[1],
                'palette' => array_values(TypographyPalette::getPalettes())[0]
            )
            
        ));
    }
    
}
