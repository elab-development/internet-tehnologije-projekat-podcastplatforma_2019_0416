<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    // Login to get Sanctum token
    public function login(Request $request)
    {
        // Validate incoming request
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            // Generate token after successful login
            $user = Auth::user();
            $token = $user->createToken('Aplikacija')->plainTextToken;

            // Return token to the client
            return response()->json(['token' => $token]);
        }

        // Return Unauthorized if credentials don't match
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    // Register user (optional - you may have this in your AuthController)
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create a new user
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Generate token for the newly registered user
        $token = $user->createToken('Aplikacija')->plainTextToken;

        // Return token
        return response()->json(['token' => $token], 201);
    }

    // public function register(Request $request)
    // {
    //     $validated = $request->validate([
    //         'name'                  => 'required|string|max:255',
    //         'email'                 => 'required|string|email|max:255|unique:users,email',
    //         'password'              => 'required|string|min:8|confirmed',
    //     ]);

    //     $user = User::create([
    //         'name'     => $validated['name'],
    //         'email'    => $validated['email'],
    //         'password' => Hash::make($validated['password']),
    //     ]);

    //     return response()->json([
    //         'message' => 'Registration successful.',
    //         'user'    => $user,
    //     ], 201);
    // }

public function forgotPassword(Request $request)
{
    $request->validate(['email' => 'required|email']);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status ===Password::RESET_LINK_SENT
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 400);
}

public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required',
        'email' => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password' => Hash::make($password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            event(new PasswordReset($user));
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => __($status)])
        : response()->json(['message' => __($status)], 400);

}

}
