<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('episodes', function (Blueprint $table) {
            $table->id();
            $table->string('kljucneReci')->notNullable(); // Ključne reči
            $table->integer('trajanje')->notNullable(); // Trajanje epizode
            $table->text('opis')->notNullable(); // Opis epizode
            $table->date('datum')->notNullable(); // Datum objave epizode
            $table->string('naslov')->notNullable(); // Naslov epizode
            $table->string('audio_video_path')->notNullable(); // Putanja do fajla
            $table->string('file_type')->notNullable(); // Tip fajla
            //$table->foreignId('guest_id');
            $table->timestamps(); // Adds 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('episodes');
    }
};
