<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateExperiencesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('experiences', function(Blueprint $table)
		{
			$table->increments('id');
			$table->string('company');
			$table->string('title');
			$table->string('location')->nullable();
			$table->longText('description')->nullable();
			$table->date('start_date');
			$table->date('end_date')->nullable();
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('experiences', function (Blueprint $table)
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
		Schema::drop('experiences');
	}

}
