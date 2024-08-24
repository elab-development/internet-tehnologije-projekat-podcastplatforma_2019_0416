<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    protected $fillable = [
        'imePrezimeG',
        'firma',
    ];

    /**
     * Get the episodes for the guest.
     */
    public function episodes()
    {
        return $this->hasMany(Episode::class);
    }
}
