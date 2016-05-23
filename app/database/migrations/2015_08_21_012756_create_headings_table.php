<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateHeadingsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('headings', function(Blueprint $table)
		{
			$table->increments('id');
            $table->enum('section', array('experience', 'education', 'skills', 'interests'));
            $table->string('title')->nullable();
            $table->string('subtitle')->nullable();
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('headings', function (Blueprint $table)
        {
            $table->foreign('resume_id')->references('id')->on('resumes')->onDelete('cascade');
        });
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('headings');
	}

}
