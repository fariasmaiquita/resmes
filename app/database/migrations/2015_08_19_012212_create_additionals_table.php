<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAdditionalsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('additionals', function(Blueprint $table)
		{
			$table->increments('id');
            $table->enum('type', array('interests', 'testimonial', 'footer'));
            $table->longText('content');
            $table->string('author')->nullable();
            $table->string('author_company')->nullable();
            $table->string('author_position')->nullable();
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('additionals', function (Blueprint $table)
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
		Schema::drop('additionals');
	}

}
