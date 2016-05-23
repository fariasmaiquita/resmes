<?php

class ResumeTableSeeder extends Seeder {

    public function run()
    {
        //DB::table('resumes')->delete();
        Resume::create(array('title' => null, 'user_id' => null));
    }

}
