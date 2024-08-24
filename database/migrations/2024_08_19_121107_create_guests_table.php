<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateGuestsAndEpisodesTables extends Migration
{
    public function up()
    {
        // Create the 'guests' table
        Schema::create('guests', function (Blueprint $table) {
            $table->id(); // Creates an unsignedBigInteger 'id' column
            $table->string('imePrezimeG'); // Guest's full name
            $table->string('firma'); // Guest's company
            $table->timestamps(); // Timestamps
        });

        // Create the 'episodes' table
        Schema::create('episodes', function (Blueprint $table) {
            $table->id(); // Creates an unsignedBigInteger 'id' column
            $table->string('kljucneReci'); // Keywords
            $table->integer('trajanje'); // Duration
            $table->text('opis'); // Description
            $table->date('datum'); // Date
            $table->string('naslov'); // Title
            $table->string('audio_video_path'); // File path
            $table->string('file_type'); // File type
            $table->unsignedBigInteger('guest_id'); // Foreign key column
            $table->timestamps(); // Timestamps

            
        });
    }

    public function down(): void
    {
        // Drop the 'episodes' table first
        Schema::dropIfExists('episodes');

        // Then drop the 'guests' table
        Schema::dropIfExists('guests');
    }
}
