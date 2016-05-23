<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateGeneralsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('generals', function(Blueprint $table)
		{
			$table->increments('id');
            $table->string('full_name');
            $table->string('headline')->nullable;
            $table->longText('summary')->nullable();
            $table->string('location')->nullable();
            $table->string('phone');
            $table->string('email');
            $table->string('website')->nullable;
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('generals', function (Blueprint $table)
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
		Schema::drop('generals');
	}

}
