<?php

namespace App\Http\Controllers;

use App\Models\Guest;
use Illuminate\Http\Request;

class GuestController extends Controller
{
    public function index()
{
    $guests = Guest::all(); // Get all guests from the database
    return response()->json($guests); // Return them as JSON
}



    // Web: Show the form to create a new guest
    public function create()
    {
        return view('guests.create'); // Assuming you have a form at 'guests.create'
    }

    // Web: Store a new guest in the database
    public function store(Request $request)
    {
        // Validation rules
        $request->validate([
            'imePrezimeG' => 'required|string',
            'firma' => 'required|string',
        ]);

        // Create a new guest
        $guest = Guest::create($request->only(['imePrezimeG', 'firma']));

        return redirect()->route('guests.index'); // Redirect to guest list after creation
    }

    // Web: Display a single guest's details in a view
    public function show($id)
    {
        $guest = Guest::findOrFail($id);
        return view('guests.show', compact('guest')); // Assuming you have a view at 'guests.show'
    }

    // Web: Show the form to edit an existing guest
    public function edit($id)
    {
        $guest = Guest::findOrFail($id);
        return view('guests.edit', compact('guest')); // Assuming you have a form at 'guests.edit'
    }

    // Web: Update the guest information
    public function update(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);

        // Validation rules
        $request->validate([
            'imePrezimeG' => 'sometimes|required|string',
            'firma' => 'sometimes|required|string',
        ]);

        // Update guest fields
        $guest->update($request->only(['imePrezimeG', 'firma']));

        return redirect()->route('guests.index'); // Redirect after update
    }

    // Web: Delete a guest by ID
    public function destroy($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return redirect()->route('guests.index'); // Redirect to guest list after deletion
    }

    // API: Retrieve all guests
    public function apiIndex()
    {
        $guests = Guest::all();
        return response()->json($guests, 200);
    }

    // API: Create a new guest
    public function apiStore(Request $request)
    {
        // Validation rules
        $request->validate([
            'imePrezimeG' => 'required|string',
            'firma' => 'required|string',
        ]);

        // Create a new guest
        $guest = Guest::create($request->only(['imePrezimeG', 'firma']));

        return response()->json(['guest' => $guest], 201);
    }

    // API: Retrieve a specific guest by ID
    public function apiShow($id)
    {
        $guest = Guest::findOrFail($id);
        return response()->json(['guest' => $guest], 200);
    }

    // API: Update an existing guest
    public function apiUpdate(Request $request, $id)
    {
        $guest = Guest::findOrFail($id);

        // Validation rules
        $request->validate([
            'imePrezimeG' => 'sometimes|required|string',
            'firma' => 'sometimes|required|string',
        ]);

        // Update guest fields
        $guest->update($request->only(['imePrezimeG', 'firma']));

        return response()->json(['guest' => $guest], 200);
    }

    // API: Delete a guest by ID
    public function apiDestroy($id)
    {
        $guest = Guest::findOrFail($id);
        $guest->delete();

        return response()->json(['message' => 'Guest deleted successfully'], 200);
    }
}
