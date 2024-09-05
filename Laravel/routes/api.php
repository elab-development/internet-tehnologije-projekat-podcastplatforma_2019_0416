<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

// Public Routes
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    // User Routes
    Route::apiResource('users', UserController::class)
        ->only(['index', 'store']); // Limited access for users

    // Episode Routes
    Route::apiResource('episodes', EpisodeController::class)
        ->only(['index', 'show']); // Publicly accessible methods

    // Guest Routes
    Route::apiResource('guests', GuestController::class)
        ->only(['index']); // Publicly accessible methods

    // User Info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Admin Routes
    Route::middleware('admin')->group(function () {
        // Admin can create, update, and delete episodes
        Route::post('episodes', [EpisodeController::class, 'store']);
        Route::put('episodes/{id}', [EpisodeController::class, 'update']);
        Route::delete('episodes/{id}', [EpisodeController::class, 'destroy']);
        Route::post('episodes/upload', [EpisodeController::class, 'upload']);
    });
});

// Other Routes
Route::resource('episode', EpisodeController::class)->only(['search', 'show']);

Route::post('password/reset', [AuthController::class, 'resetPassword']);

Route::get('episodes/search', [EpisodeController::class, 'search']);
