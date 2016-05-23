<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSettingsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('settings', function(Blueprint $table)
		{
			$table->increments('id');
            $table->boolean('findable');
            $table->boolean('recommendable');
            $table->boolean('previewable');
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('settings', function (Blueprint $table)
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
		Schema::drop('settings');
	}

}
