<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTypographiesTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('typographies', function(Blueprint $table)
		{
			$table->increments('id');
            $table->enum('section', array('headings', 'body', 'italics', 'size', 'color'));
            $table->string('font_family')->nullable();
            $table->enum('font_size', array('0.9em', '0.95em', '1em'))->nullable();
            $table->string('palette_color')->nullable();
            $table->integer('resume_id')->unsigned();
			$table->timestamps();
		});
        Schema::table('typographies', function (Blueprint $table)
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
		Schema::drop('typographies');
	}

}
