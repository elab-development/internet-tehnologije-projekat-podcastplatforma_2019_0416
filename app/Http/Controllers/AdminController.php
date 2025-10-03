<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Episode;
use App\Models\Guest;
use App\Models\User;

class AdminController extends Controller
{
    public function getStats()
    {
        $stats = [
            'episodes' => Episode::count(),
            'guests' => Guest::count(),
            'users' => User::count(),
        ];

        return response()->json($stats);
    }
}
