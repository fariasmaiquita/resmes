<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEducationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('educations', function(Blueprint $table)
		{
			$table->increments('id');
            $table->string('school');
            $table->string('degree');
            $table->string('course');
            $table->longText('description')->nullable();
            $table->date('start_year');
			$table->date('end_year')->nullable();
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('educations', function (Blueprint $table)
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
		Schema::drop('educations');
	}

}
