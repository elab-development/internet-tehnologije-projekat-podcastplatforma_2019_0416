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
        // $request->validate(['email' => 'required|email']);

        // $status = Password::sendResetLink(
        //     $request->only('email')
        // );

        // $response = ['message' => __($status)];

        // if (config('app.env') !== 'production' && $status === Password::RESET_LINK_SENT) {
        //     $token = DB::table('password_reset_tokens')
        //         ->where('email', $request->email)
        //         ->first();

        //     if ($token) {
        //         $response['reset_token'] = $token->token;
        //     }
        // }

        // return $status === Password::RESET_LINK_SENT
        //     ? response()->json($response)
        //     : response()->json($response, 400);

        $request->validate(['email' => 'required|email']);

    // Generate the plain token first (for development use)
        $plainToken = null;
        if (config('app.env') !== 'production') {
            $plainToken = Str::random(64); // This is the token we'll return
        }

        $status = Password::sendResetLink(
            $request->only('email'),
            function ($user, $token) use (&$plainToken) {
                if (config('app.env') !== 'production') {
                $plainToken = $token; // Capture the plain token from the callback
                }
            }
        );

        $response = ['message' => __($status)];

    // For development/testing: include the plain token in response
        if (config('app.env') !== 'production' && $status === Password::RESET_LINK_SENT && $plainToken) {
            $response['reset_token'] = $plainToken;
        }

        return $status === Password::RESET_LINK_SENT
            ? response()->json($response)
            : response()->json($response, 400);


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

    // return $status === Password::PASSWORD_RESET
    //     ? response()->json(['message' => __($status)])
    //     : response()->json(['message' => __($status)], 400);

        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['message' => 'Password reset successfully']);
        }

        return response()->json([
            'message' => 'Password reset failed',
            'errors' => ['email' => [__($status)]]
        ], 400);

    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }


    public function getResetToken(Request $request)
    {
        if (config('app.env') === 'production') {
            return response()->json(['message' => 'Not available in production'], 403);
        }

        $request->validate(['email' => 'required|email']);

        $token = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$token) {
            return response()->json(['message' => 'No reset token found'], 404);
        }

        return response()->json(['reset_token' => $token->token]);
    }




}
