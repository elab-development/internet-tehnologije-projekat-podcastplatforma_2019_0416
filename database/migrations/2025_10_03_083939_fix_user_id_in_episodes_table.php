<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Prvo dodaj kolonu bez foreign key-a
        Schema::table('episodes', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable()->after('guest_id');
        });

        // Postavi default vrednost za postojeće redove (prvi admin user)
        DB::table('episodes')->update(['user_id' => 1]);

        // Sada dodaj foreign key constraint
        Schema::table('episodes', function (Blueprint $table) {
            $table->foreignId('user_id')->nullable(false)->change();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('episodes', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');
        });
    }
};
