<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EpisodeController extends Controller {
    // GET /api/episodes
    public function index() {
        return Episode::all(); // Vraća sve epizode
    }

    // POST /api/episodes
    public function store(Request $request) {
        // Validacija
        $request->validate([
            'kljucneReci' => 'required|string',
            'trajanje' => 'required|integer',
            'opis' => 'required|string',
            'datum' => 'required|date',
            'naslov' => 'required|string',
            'audio_video' => 'required|file|mimes:mp3,mp4,wav', // Validacija za fajl
        ]);

        // Čuvanje fajla
        $path = $request->file('audio_video')->store('episodes'); // Čuva fajl u folderu 'episodes'

        // Kreiranje nove epizode
        $episode = Episode::create([
            'kljucneReci' => $request->kljucneReci,
            'trajanje' => $request->trajanje,
            'opis' => $request->opis,
            'datum' => $request->datum,
            'naslov' => $request->naslov,
            'audio_video_path' => $path, // Putanja do fajla
            'file_type' => $request->file('audio_video')->getClientOriginalExtension(), // Tip fajla
        ]);

        return response()->json(['episode' => $episode], 201);
    }

    // GET /api/episodes/{id}
    public function show($id) {
        $episode = Episode::findOrFail($id); // Vraća epizodu po ID-u
        // Generiši URL za medijski fajl 
        $mediaUrl = Storage::url($episode->audio_video_path);

        return response()->json([
            'episode' => $episode,
            'media_url' => $mediaUrl,
        ], 200);
    } // Dodaj URL za reprodukciju 

    // GET /api/episodes/{id}
    public function show($keywords) {
        $episode = Episode::findByKeywordsOrFail($keywords); // Vraća epizodu po ključnim rečima
        // Generiši URL za medijski fajl 
        $mediaUrl = Storage::url($episode->audio_video_path);

        return response()->json([
            'episode' => $episode,
            'media_url' => $mediaUrl,
        ], 200);
    } // Dodaj URL za reprodukciju 


    // PUT/PATCH /api/episodes/{id}
    public function update(Request $request, $id) {
        $episode = Episode::findOrFail($id); // Pronađi epizodu

        // Validacija
        $request->validate([
            'kljucneReci' => 'sometimes|required|string',
            'trajanje' => 'sometimes|required|integer',
            'opis' => 'sometimes|required|string',
            'datum' => 'sometimes|required|date',
            'naslov' => 'sometimes|required|string',
            'audio_video' => 'sometimes|file|mimes:mp3,mp4,wav', // Validacija za fajl
        ]);

        // Ažuriranje epizode
        if ($request->hasFile('audio_video')) {
            // Ako se fajl menja, prvo obriši stari
            Storage::delete($episode->audio_video_path); // Briše stari fajl

            // Čuvanje novog fajla
            $path = $request->file('audio_video')->store('episodes'); // Čuva novi fajl
            $episode->audio_video_path = $path; // Ažurira putanju
            $episode->file_type = $request->file('audio_video')->getClientOriginalExtension(); // Ažurira tip fajla
        }

        $episode->update($request->except('audio_video')); // Ažurira ostale podatke

        return response()->json(['episode' => $episode], 200);
    }

    // DELETE /api/episodes/{id}
    public function destroy($id) {
        $episode = Episode::findOrFail($id); // Pronađi epizodu

        // Briši fajl pre nego što obrišeš epizodu
        Storage::delete($episode->audio_video_path); // Briše fajl

        Episode::destroy($id); // Briše epizodu
        return response()->json(['message' => 'Episode deleted successfully'], 200);
    }
}
