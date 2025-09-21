<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    /*public function up(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            //
        });
    }*/

    public function up()
    {
    Schema::table('guests', function (Blueprint $table) {
        $table->string('firma')->nullable(); // or ->default('some value')
    });
    }

    /**
     * Reverse the migrations.
     */
    /*public function down(): void
    {
        Schema::table('guests', function (Blueprint $table) {
            //
        });
    }*/

    public function down()
    {
    Schema::table('guests', function (Blueprint $table) {
        $table->dropColumn('firma');
    });
    }
};
