<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RegisteredUserController;


// Public routes (no authentication required)
Route::get('/guests', [GuestController::class, 'index'])->name('guests.index'); // List all guests
Route::get('/episodes', [EpisodeController::class, 'index'])->name('episodes.index'); // List all episodes
Route::get('/episodes/{id}', [EpisodeController::class, 'show'])->whereNumber('id')->name('episodes.show'); // Show episode details

Route::post('login', [AuthController::class, 'login']); // Login route
Route::post('register', [AuthController::class, 'register']); // Registration route

Route::middleware('auth:sanctum')->apiResource('episodes', EpisodeController::class)->except(['index', 'show'])->where(['episode' => '[0-9]+']);
// Guest routes (Create a guest) - Protected by authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/guests', [GuestController::class, 'store'])->name('guests.store'); // Store a new guest

    // Episode routes (Create, update, delete episodes) - Protected by authentication
    Route::get('/episodes/{id}/edit', [EpisodeController::class, 'edit'])->name('episodes.edit'); // Form to edit an episode
    Route::put('/episodes/{id}', [EpisodeController::class, 'update'])->name('episodes.update'); // Update an episode
    Route::delete('/episodes/{id}', [EpisodeController::class, 'destroy'])->name('episodes.destroy'); // Delete an episode

    // User routes (only authenticated users can access user management)
    Route::get('/users', [UserController::class, 'index'])->name('users.index'); // List all users
    Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show'); // Get a specific user by ID

    // Profile routes (for authenticated users)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Password reset
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// Upload
Route::middleware('auth:sanctum')->post('/episodes/upload', [EpisodeController::class, 'upload'])->name('episodes.upload');

// Search
Route::get('/episodes/search', [EpisodeController::class, 'search'])->name('episodes.search');

// Resource route


Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

if (!app()->environment('production')) {
    Route::post('/get-reset-token', [AuthController::class, 'getResetToken']);
}
