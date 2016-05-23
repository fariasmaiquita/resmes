<?php

class Experience extends Eloquent {

	protected $table = 'experiences';

	protected $fillable = array(
        'company',
        'title',
        'location',
        'description',
        'start_date',
        'end_date',
        'resume_id'
    );
    
    public $timestamps = true;
    
    public static function validatorRules()
    {
        return array(
            'company' => 'required',
            'title' => 'required',
            'entered_start_date' => 'required|date',
            'start_date' => 'required|numeric|max:' . time(),
            'entered_end_date' => 'date',
            'end_date' => 'numeric|max:' . time()
        );
    }
    
    public function resume()
    {
		return $this->belongsTo('Resume');
	}
    
}
