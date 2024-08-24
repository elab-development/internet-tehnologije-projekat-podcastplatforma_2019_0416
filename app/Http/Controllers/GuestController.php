<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    // GET /api/guests
    public function index()
    {
        return Guest::all(); // Vraća sve goste
    }

    // POST /api/guests
    public function store(Request $request)
    {
        // Validacija
        $request->validate([
            'imePrezimeG' => 'required|string',
            'firma' => 'required|string',
        ]);

        // Kreiranje novog gosta
        $guest = Guest::create($request->all());

        return response()->json(['guest' => $guest], 201);
    }

    // GET /api/guests/{id}
    public function show($id)
    {
        $guest = Guest::findOrFail($id); // Vraća gosta po ID-u
        return response()->json(['guest' => $guest], 200);
    }

    // PUT/PATCH /api/guests/{id}
    public function update(Request $request, $id)
    {
        $guest = Guest::findOrFail($id); // Pronađi gosta

        // Validacija
        $request->validate([
            'imePrezimeG' => 'sometimes|required|string',
            'firma' => 'sometimes|required|string',
        ]);

        // Ažuriranje gosta
        $guest->update($request->all());

        return response()->json(['guest' => $guest], 200);
    }

    // DELETE /api/guests/{id}
    public function destroy($id)
    {
        Guest::destroy($id); // Briše gosta
        return response()->json(['message' => 'Guest deleted successfully'], 200);
    }
}
