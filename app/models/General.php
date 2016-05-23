<?php

class General extends Eloquent {

	protected $table = 'generals';

	protected $fillable = array(
        'full_name',
        'headline',
        'summary',
        'location',
        'phone',
        'email',
        'website',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules($profileEntry)
    {
        if ($profileEntry) {
            return array('full_name' => 'required');
        }
        return array(
            'phone' => 'required|regex:/^[\d\s()+-]*$/',
            'email' => 'required|email'
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
