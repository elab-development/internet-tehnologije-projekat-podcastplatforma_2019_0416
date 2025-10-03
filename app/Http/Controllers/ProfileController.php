<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request)
    {
    // Ako je API zahtev, vrati JSON
        if ($request->expectsJson()) {
            $user = $request->user();
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'email_verified_at' => $user->email_verified_at,
            ]);
        }

    // Inače vrati Inertia response
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request)
    {
        $user = $request->user();

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

    // Ako je API zahtev, vrati JSON
        if ($request->expectsJson()) {
            return response()->json([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->is_admin,
                'email_verified_at' => $user->email_verified_at,
                'message' => 'Profile updated successfully'
            ]);
        }

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required'],
        ]);

        $user = $request->user();

    // Proveri password manually
        if (!\Hash::check($request->password, $user->password)) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'The provided password is incorrect.'
                ], 422);
            }
            return back()->withErrors(['password' => 'The provided password is incorrect.']);
        }

    // Ako je password tačan, obriši korisnika
        $user->delete();

    // API response - vrati success
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Account deleted successfully'
            ], 200); // Explicitno vrati 200 status
        }

    // Web version
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return Redirect::to('/');
    }
}
