<?php

class AbstractExportController extends \BaseController {

	protected function resumeData($resumeId)
    {
        return array(
            'defaults' => array(
                'font' => array_values(TypographyFont::getFonts())[3],
                'size' => array_values(TypographyFont::getSizes())[1],
                'palette' => array_values(TypographyPalette::getPalettes())[0]
            ),
            'typography' => array(
                'headings' => Typography::where('resume_id', $resumeId)->where('section', 'headings'),
                'body' => Typography::where('resume_id', $resumeId)->where('section', 'body'),
                'italics' => Typography::where('resume_id', $resumeId)->where('section', 'italics'),
                'size' => Typography::where('resume_id', $resumeId)->where('section', 'size'),
                'color' => Typography::where('resume_id', $resumeId)->where('section', 'color')
            ),
            'general' => General::where('resume_id', $resumeId),
            'present_experience' => Experience::where('resume_id', $resumeId)
                ->where('end_date', null)->orderBy('start_date', 'desc'),
            'experience' => Experience::where('resume_id', $resumeId)
                ->orderBy('end_date', 'desc')->orderBy('start_date', 'desc'),
            'present_education' => Education::where('resume_id', $resumeId)
                ->where('end_year', null)->orderBy('start_year', 'desc'),
            'education' => Education::where('resume_id', $resumeId)
                ->orderBy('end_year', 'desc')->orderBy('start_year', 'desc'),
            'skill' => Skill::where('resume_id', $resumeId)->orderBy('listing_index'),
            'additional' => Additional::where('resume_id', $resumeId),
            'heading' => array(
                'experience' => Heading::where('resume_id', $resumeId)->where('section', 'experience'),
                'education' => Heading::where('resume_id', $resumeId)->where('section', 'education'),
                'skills' => Heading::where('resume_id', $resumeId)->where('section', 'skills'),
                'interests' => Heading::where('resume_id', $resumeId)->where('section', 'interests')
            )
        );
    }
    
}
