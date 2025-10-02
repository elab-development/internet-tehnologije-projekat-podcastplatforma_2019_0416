<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // Login method ostaje isti
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            $token = $user->createToken('Aplikacija')->plainTextToken;
            return response()->json(['token' => $token]);
        }

        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Register method ostaje isti
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $token = $user->createToken('Aplikacija')->plainTextToken;
        return response()->json(['token' => $token], 201);
    }

    // FORGOT PASSWORD - MODIFIKOVANA METODA
    public function forgotPassword(Request $request)
    {
        try {
            $request->validate(['email' => 'required|email']);

            // Proveri da li korisnik postoji
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'If the email exists, a reset link has been sent.'
                ]);
            }

            // Generiši token
            $token = Str::random(64);

            // Sačuvaj token u bazu
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'token' => Hash::make($token),
                    'created_at' => now()
                ]
            );

            // Vrati link direktno u response
            $resetUrl = "http://localhost:3000/reset-password/{$token}?email=" . urlencode($request->email);

            return response()->json([
                'message' => 'Password reset link generated successfully. Copy this link: ' . $resetUrl,
                'reset_url' => $resetUrl,
                'reset_token' => $token
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    // RESET PASSWORD - MODIFIKOVANA METODA
    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            // Pronađi token
            $record = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->first();

            if (!$record) {
                return response()->json([
                    'message' => 'Invalid or expired reset token'
                ], 400);
            }

            // Proveri token
            if (!Hash::check($request->token, $record->token)) {
                return response()->json([
                    'message' => 'Invalid reset token'
                ], 400);
            }

            // Resetuj password
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();

            // Obriši token
            DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->delete();

            return response()->json([
                'message' => 'Password reset successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Server error'], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}
