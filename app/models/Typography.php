<?php

class Typography extends Eloquent {

	protected $table = 'typographies';

	protected $fillable = array(
        'section',
        'font_family',
        'font_size',
        'palette_color',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules($resumeId, $typographyId)
    {
        $except = is_null($typographyId) ? 'NULL' : $typographyId;
        return array(
            'section' => 'required|in:headings,body,italics,size,color',
            'section' => 'unique:typographies,section,' . $except . ',id,resume_id,' . $resumeId
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
