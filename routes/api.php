<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\EpisodeController;
use App\Http\Controllers\GuestController;
use App\Http\Controllers\AuthController;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('episodes', EpisodeController::class);
    Route::apiResource('guests', GuestController::class);
});

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::post('logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware('auth:sanctum')->group(function () {
    Route::post('api/episodes', [EpisodeController::class, 'store'])->middleware('admin');
    Route::put('api/episodes/{id}', [EpisodeController::class, 'store'])->middleware('admin');
});