<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class DropFirmaFromGuestsTable extends Migration
{
    public function up()
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->dropColumn('firma'); // Brisanje kolone 'firma'
        });
    }

    public function down()
    {
        Schema::table('guests', function (Blueprint $table) {
            $table->string('firma'); // Ponovno dodavanje kolone 'firma'
        });
    }
}
