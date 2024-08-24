<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Episode extends Model
{
    use HasFactory;

    protected $fillable = [
        'kljucneReci',
        'trajanje',
        'opis',
        'datum',
        'naslov',
        'audio_video_path',
        'file_type',
        'guest_id',
    ];

    /**
     * Get the guest that owns the episode.
     */
    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
