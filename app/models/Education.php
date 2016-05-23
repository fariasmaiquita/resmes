<?php

class Education extends Eloquent {

	protected $table = 'educations';

	protected $fillable = array(
        'school',
        'degree',
        'course',
        'description',
        'start_year',
        'end_year',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules()
    {
        return array(
            'school' => 'required',
            'degree' => 'required',
            'course' => 'required',
            'start_year' => 'required|numeric|min:1970|max:' . date('Y'),
            'end_year' => 'numeric|min:1970|max:2038'
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
