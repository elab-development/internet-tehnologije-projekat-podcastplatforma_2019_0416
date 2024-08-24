<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddGuestIdToEpisodesTable extends Migration
{
    public function up()
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->unsignedBigInteger('guest_id')->after('audio_video_path'); // Dodavanje kolone 'guest_id'
            $table->foreign('guest_id')->references('id')->on('guests')->onDelete('cascade'); // Postavljanje stranog ključa
        });
    }

    public function down()
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->dropForeign(['guest_id']); // Uklanjanje stranog ključa
            $table->dropColumn('guest_id'); // Brisanje kolone
        });
    }
}

