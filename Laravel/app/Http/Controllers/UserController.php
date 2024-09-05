<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        return User::all(); // Vraća sve korisnike
    }

    // POST /api/users
    public function store(Request $request)
    {
        // Validacija
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
            'isAdmin' => false,
        ]);

        return response()->json(['user' => $user], 201);
    }

    // GET /api/users/{id}
    public function show($id)
    {
        $user = User::findOrFail($id); // Vraća korisnika po ID-u
        return response()->json(['user' => $user], 200);
    }

    // PUT/PATCH /api/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id); // Pronađi korisnika

        // Izbacena mogucnost da se menja isAdmin
        $request -> offsetUnset('isAdmin'); // (valjda)

        // Validacija
        $request->validate([
            'role' => 'sometimes|required|string',
            'email' => 'sometimes|required|string|email|unique:users,email,' . $user->id,
            'imeprezime' => 'sometimes|required|string',
            'password' => 'sometimes|required|string|min:6',
        ]);

        // Ažuriranje korisnika
        if ($request->has('password')) {
            $request['password'] = Hash::make($request['password']); // Hashovanje nove lozinke
        }

        $user->update($request->all()); // Ažurira korisnika

        return response()->json(['user' => $user], 200);
    }

    // DELETE /api/users/{id}
    public function destroy($id)
    {
        User::destroy($id); // Briše korisnika
        return response()->json(['message' => 'User deleted successfully'], 200);
    }
}
