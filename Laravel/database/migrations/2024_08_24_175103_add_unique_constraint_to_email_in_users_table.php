<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddUniqueConstraintToEmailInUsersTable extends Migration
{
    public function up()
    {
        // Dodavanje jedinstvenog ograničenja na 'email' kolonu
        Schema::table('users', function (Blueprint $table) {
            // Prvo proveri da li email već nije jedinstven
            $table->string('email')->unique()->change(); // Postavljanje jedinstvenog ograničenja
        });
    }

    public function down()
    {
        // Uklanjanje jedinstvenog ograničenja
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['email']); // Uklanjanje jedinstvenog ograničenja
        });
    }
}
