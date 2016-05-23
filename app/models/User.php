<?php

use Illuminate\Database\Eloquent\SoftDeletingTrait;

class User extends Eloquent {

	use SoftDeletingTrait;

	protected $table = 'users';

	protected $fillable = array(
        'name',
        'email',
        'facebook'
    );
    
    protected $dates = array('deleted_at');
    
    public $timestamps = true;
    
    public function resumes()
    {
		return $this->hasMany('Resume');
	}
    
}
