<?php

class Additional extends Eloquent {

	protected $table = 'additionals';

	protected $fillable = array(
        'type',
        'content',
        'author',
        'author_company',
        'author_position',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules($resumeId, $additionalId)
    {
        $except = is_null($additionalId) ? 'NULL' : $additionalId;
        return array(
            'type' => 'required|in:interests,testimonial,footer',
            'type' => 'unique:additionals,type,' . $except . ',id,resume_id,' . $resumeId,
            'content' => 'required',
            'author' => 'required_if:type,testimonial'
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
