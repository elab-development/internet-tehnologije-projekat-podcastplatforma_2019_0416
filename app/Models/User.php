<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens; // Add Sanctum trait

class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens; // Use HasApiTokens for Sanctum

    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // Add the 'role' field to fillable
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'isAdmin' => 'boolean', // Cast the 'isAdmin' attribute to boolean
        ];
    }

    /**
     * Get the episodes associated with the user.
     * One user can have many episodes.
     */
    public function episodes(): HasMany
    {
        return $this->hasMany(Episode::class);
    }

    /**
     * Check if the user is an admin.
     * This method returns true if the user has the 'admin' role or if 'isAdmin' is true.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin' || $this->isAdmin; // Assuming 'admin' role or 'isAdmin' field
    }

    // Other relationship methods can be added here as needed
}
