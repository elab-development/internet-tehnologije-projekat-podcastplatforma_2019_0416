<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;

// Public routes
Route::get('/guests', [GuestController::class, 'index'])->name('guests.index');
Route::get('/episodes', [EpisodeController::class, 'index'])->name('episodes.index');
Route::get('/episodes/{id}', [EpisodeController::class, 'show'])->whereNumber('id')->name('episodes.show');
Route::get('/episodes/search', [EpisodeController::class, 'search'])->name('episodes.search');

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

// Password reset
Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');

// Admin only routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    // Episode management (samo admin)
    Route::post('/episodes', [EpisodeController::class, 'store'])->name('episodes.store');
    Route::put('/episodes/{id}', [EpisodeController::class, 'update'])->name('episodes.update');
    Route::delete('/episodes/{id}', [EpisodeController::class, 'destroy'])->name('episodes.destroy');
    Route::post('/episodes/upload', [EpisodeController::class, 'upload'])->name('episodes.upload');

    // Guest management (samo admin)
    Route::post('/guests', [GuestController::class, 'store'])->name('guests.store');
});

// Authenticated user routes (svi autentifikovani korisnici)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::post('/logout', [AuthController::class, 'logout']);

    // User management (samo admin, ali ostaje u auth grupi)
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
    });
});

// Development only routes
if (!app()->environment('production')) {
    Route::post('/get-reset-token', [AuthController::class, 'getResetToken']);
}
