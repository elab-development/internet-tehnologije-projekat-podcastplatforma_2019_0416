<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes (no authentication required)
Route::get('/', [GuestController::class, 'index'])->name('guests.index'); // List all guests
Route::get('guests', [GuestController::class, 'index'])->name('guests.index'); // List all guests
Route::get('/episodes', [EpisodeController::class, 'index'])->name('episodes.index'); // List all episodes
Route::get('/episodes/{id}', [EpisodeController::class, 'show'])->name('episodes.show'); // Show episode details
Route::post('/login', [AuthController::class, 'login']);

// Guest routes (Create a guest) - Protected by authentication
Route::middleware('auth:sanctum')->group(function () {
    // Guest routes
    Route::get('create', [GuestController::class, 'create'])->name('guests.create'); // Form to create a new guest
    Route::post('guests', [GuestController::class, 'store'])->name('guests.store'); // Store a new guest

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

// Inertia routes for the frontend
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Dashboard route (protected for authenticated users)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth:sanctum', 'verified'])->name('dashboard');

// Authentication routes
require __DIR__.'/auth.php';
