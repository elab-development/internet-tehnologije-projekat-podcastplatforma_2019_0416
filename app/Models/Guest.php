<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    // Specify the table name if it doesn’t follow Laravel's naming convention
    protected $table = 'guests';

    // Specify the attributes that are mass assignable
    protected $fillable = ['imePrezimeG', 'firma', 'bio', 'image'];

    // Optionally define hidden attributes, e.g. to hide sensitive information
    protected $hidden = [
        'created_at', 'updated_at', // If you don't want to expose timestamps
    ];

    // Define relationships (if any)
    // Example: A guest can have many episodes
    public function episodes()
    {
        return $this->hasMany(Episode::class);
    }

    // Define a custom method to get a formatted name, if necessary
    public function getFormattedNameAttribute()
    {
        return strtoupper($this->imePrezimeG);
    }
}
