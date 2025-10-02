<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;


class EpisodeController extends Controller
{
    // GET /api/episodes - Fetch all episodes
    public function index()
    {
        return response()->json(Episode::all(), 200);
    }

    // POST /api/episodes - Create a new episode
    public function store(Request $request)
    {
        // // Validation rules
        // $request->validate([
        //     'kljucneReci' => 'required|string',
        //     'trajanje' => 'required|integer',
        //     'opis' => 'required|string',
        //     'datum' => 'required|date',
        //     'naslov' => 'required|string',
        //     'audio_video' => 'required|file|mimes:mp3,mp4,wav|max:20480', // File validation with max size 20MB
        // ]);

        // // Store the uploaded file and retrieve the path
        // $path = $request->file('audio_video')->store('episodes');

        // // Create and save a new episode
        // $episode = Episode::create([
        //     'kljucneReci' => $request->kljucneReci,
        //     'trajanje' => $request->trajanje,
        //     'opis' => $request->opis,
        //     'datum' => $request->datum,
        //     'naslov' => $request->naslov,
        //     'audio_video_path' => $path,
        //     'file_type' => $request->file('audio_video')->getClientOriginalExtension(),
        // ]);

        // return response()->json(['episode' => $episode], 201);

        $request->validate([
            'audio_video' => 'required|file|mimes:mp3,mp4,wav|mimetypes:video/mp4,video/mpeg,audio/mpeg,audio/wav|max:20480',
            'title' => 'required|string',
            'description' => 'required|string',
            'guest_id' => 'required|exists:guests,id'
        ]);

        // Store the file
        $path = $request->file('audio_video')->store('episodes', 'public');

        // Create episode record
        $episode = Episode::create([
            'naslov' => $request->title,
            'opis' => $request->description,
            'audio_video_path' => $path,
            'file_type' => $request->file('audio_video')->getClientOriginalExtension(),
            'kljucneReci' => $request->keywords ?? '',
            'trajanje' => 0, // dodati logiku za izracunavanje trajanja
            'datum' => now(),
            'guest_id' => $request->guest_id
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'episode' => $episode,
            'file_url' => asset("storage/$path")
        ], 201);
    }

    public function search(Request $request)
    {

        $searchTerm = $request->query('search') ?: $request->query('kljucneReci');

        if (!$searchTerm) {
        return response()->json([], 200);
        }

        $episodes = Episode::where('naslov', 'like', '%' . $searchTerm . '%')
            ->orWhere('opis', 'like', '%' . $searchTerm . '%')
            ->orWhere('kljucneReci', 'like', '%' . $searchTerm . '%')
            ->get();

        return response()->json($episodes, 200);
        // $searchTerm = $request->query('kljucneReci'); //ili input

        // $episodes = Episode::where('kljucneReci', 'like', '%' . $searchTerm . '%')->get();

        // return response()->json(['episodes' => $episodes], 200);
    }

    // GET /api/episodes/{id} - Retrieve a specific episode
    public function show($id)
    {
        $episode = Episode::findOrFail($id);

        // Generate URL for the media file
        $mediaUrl = Storage::url($episode->audio_video_path);

        return response()->json([
            'episode' => $episode,
            'media_url' => $mediaUrl,
        ], 200);
    }

    // PUT/PATCH /api/episodes/{id} - Update an existing episode
    public function update(Request $request, $id)
    {
        $episode = Episode::findOrFail($id);

        // Validation rules for update
        $request->validate([
            'kljucneReci' => 'sometimes|required|string',
            'trajanje' => 'sometimes|required|integer',
            'opis' => 'sometimes|required|string',
            'datum' => 'sometimes|required|date',
            'naslov' => 'sometimes|required|string',
            'audio_video' => 'sometimes|file|mimes:mp3,mp4,wav|max:20480',
        ]);

        // Handle file update if a new file is uploaded
        if ($request->hasFile('audio_video')) {
            // Delete the existing file
            Storage::delete($episode->audio_video_path);

            // Store the new file
            $path = $request->file('audio_video')->store('episodes');
            $episode->audio_video_path = $path;
            $episode->file_type = $request->file('audio_video')->getClientOriginalExtension();
        }

        // Update the episode fields, excluding 'audio_video'
        $episode->update($request->except('audio_video'));

        return response()->json(['episode' => $episode], 200);
    }

    // DELETE /api/episodes/{id} - Delete an episode
    public function destroy($id)
    {
        $episode = Episode::findOrFail($id);

        // Delete associated file
        Storage::delete($episode->audio_video_path);

        // Delete the episode record
        $episode->delete();

        return response()->json(['message' => 'Episode deleted successfully'], 200);
    }

    public function upload(Request $request) //da li je user admin
    {
        $request->validate([
            'audio_video' => 'required|file|mimes:mp3,mp4,wav|mimetypes:video/mp4,video/mpeg,audio/mpeg,audio/wav|max:20480',
            'title' => 'required|string',
            'description' => 'required|string',
            'guest_id' => 'required|exists:guests,id'
        ]);

        // Store the file
        $path = $request->file('audio_video')->store('episodes', 'public');

        // Create episode record
        $episode = Episode::create([
            'naslov' => $request->title,
            'opis' => $request->description,
            'audio_video_path' => $path,
            'file_type' => $request->file('audio_video')->getClientOriginalExtension(),
         'kljucneReci' => $request->keywords ?? '',
            'trajanje' => 0, // dodati logiku za izracunavanje trajanja
         'datum' => now(),
         'guest_id' => $request->guest_id
        ]);

        return response()->json([
            'message' => 'File uploaded successfully',
            'episode' => $episode,
            'file_url' => asset("storage/$path")
        ], 201);
    }

}
