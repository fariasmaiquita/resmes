<?php

class Heading extends Eloquent {

	protected $table = 'headings';

	protected $fillable = array(
        'section',
        'title',
        'subtitle',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules($resumeId, $headingId)
    {
        $except = is_null($headingId) ? 'NULL' : $headingId;
        return array(
            'section' => 'required|in:experience,education,skills,interests',
            'section' => 'unique:headings,section,' . $except . ',id,resume_id,' . $resumeId,
            'title' => 'required_with:subtitle'
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
