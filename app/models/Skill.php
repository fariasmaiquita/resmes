<?php

class Skill extends Eloquent {

	protected $table = 'skills';

	protected $fillable = array(
        'expertise',
        'details',
        'listing_index',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules()
    {
        return array('expertise' => 'required');
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
