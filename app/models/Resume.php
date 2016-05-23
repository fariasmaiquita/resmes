<?php

class Resume extends Eloquent {

	protected $table = 'resumes';

	protected $fillable = array(
        'title',
        'draft',
        'user_id'
    );
    
    public $timestamps = true;
    
    public function user() { return $this->belongsTo('User'); }
    
    public function typographies() { return $this->hasMany('Typography'); }
    public function general() { return $this->hasOne('General'); }
    public function experiences() { return $this->hasMany('Experience'); }
    public function educations() { return $this->hasMany('Education'); }
    public function skills() { return $this->hasMany('Skill'); }
    public function additionals() { return $this->hasMany('Additional'); }
    public function headings() { return $this->hasMany('Heading'); }
    
    
}
