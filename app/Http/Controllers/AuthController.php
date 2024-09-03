<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Sanctum\PersonalAccessToken;

class AuthController extends Controller
{
    // Registracija novog korisnika
    public function register(Request $request)
    {
        // Validacija ulaznih podataka
        $request->validate([
            'role' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'imeprezime' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        // Kreiranje novog korisnika
        $user = User::create([
            'role' => $request->role,
            'email' => $request->email,
            'imeprezime' => $request->imeprezime,
            'password' => Hash::make($request->password), // Hashovanje lozinke
            'isAdmin' => false, // Podrazumevana vrednost
        ]);

        // Vraćanje uspešnog odgovora
        return response()->json(['user' => $user], 201);
    }

    // Prijava korisnika
    public function login(Request $request)
    {
        // Validacija ulaznih podataka
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Proverava kredencijale
        if (Auth::attempt($request->only('email', 'password'))) {
            // Autentifikovani korisnik
            $user = Auth::user();
            // Vraća korisnika sa tokenom (ako koristiš API token)
            return response()->json(['user' => $user], 200);
        }

        // Ako kredencijali nisu ispravni
        return response()->json(['message' => 'Unauthorized'], 401);
    }

    public function resetPassword(Request $request)
    {
        // Validacija podataka
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        // Pronađi korisnika i ažuriraj lozinku
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json(['message' => 'Password has been reset successfully.']);
    }


    // Odjava korisnika
    public function logout(Request $request)
    {
        Auth::logout(); // Odjavljuje korisnika
        return response()->json(['message' => 'Logout successful'], 200);
    }
}
