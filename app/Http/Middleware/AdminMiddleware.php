<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = Auth::user(); // Koristi Auth::user() umesto $request->user()

        // Proveri da li je korisnik autentifikovan i da li je admin
        if (!$user || !$user->isAdmin()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return response()->json(['message' => 'Forbidden — admin only'], Response::HTTP_FORBIDDEN);
            }
            return redirect('/login');
        }

        return $next($request);
    }
}
