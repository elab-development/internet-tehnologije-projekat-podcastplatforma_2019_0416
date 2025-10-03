<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Episode extends Model
{
    use HasFactory;

    protected $fillable = [
        'naslov',
        'kljucneReci',
        'trajanje',
        'opis',
        'datum',
        'audio_video_path',
        'file_type',
        'guest_id', 
        'user_id',
    ];

    /**
     * Get the user that owns the episode.
     * Each episode belongs to one user (creator).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the guest that the episode belongs to.
     * Each episode belongs to one guest.
     */
    public function guest(): BelongsTo
    {
        return $this->belongsTo(Guest::class);
    }
}
