<?php

namespace App\Http\Controllers;

use App\Models\Episode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;

class EpisodeController extends Controller
{
    // GET /api/episodes - Fetch all episodes
    public function index()
    {
        $episodes = Episode::with('guest')->orderBy('datum', 'desc')->get();
        return response()->json($episodes, 200);
    }

    // POST /api/episodes - Create a new episode
    public function store(Request $request)
    {
        try {
            Log::info('Store method called', ['request_data' => $request->all()]);

            $validated = $request->validate([
                'audio_video' => 'required|file|mimes:mp3,mp4,wav|max:20480', // 20MB
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'guest_id' => 'required|exists:guests,id',
                'keywords' => 'nullable|string'
            ]);

            Log::info('Validation passed');

            // Store the file
            $file = $request->file('audio_video');
            $path = $file->store('episodes', 'public');

            Log::info('File stored', ['path' => $path]);

            // Create episode record
            $episode = Episode::create([
                'naslov' => $validated['title'],
                'opis' => $validated['description'],
                'audio_video_path' => $path,
                'file_type' => $file->getClientOriginalExtension(),
                'kljucneReci' => $validated['keywords'] ?? '',
                'trajanje' => 0,
                'datum' => now(),
                'guest_id' => $validated['guest_id'],
                'user_id' => auth()->id()
            ]);

            Log::info('Episode created', ['episode_id' => $episode->id]);

            // Load the guest relationship
            $episode->load('guest');

            return response()->json([
                'message' => 'Episode uploaded successfully',
                'episode' => $episode,
                'file_url' => asset("storage/$path")
            ], 201);

        } catch (\Exception $e) {
            Log::error('Upload error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Upload failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function search(Request $request)
    {
        $searchTerm = $request->query('search') ?: $request->query('kljucneReci');

        if (!$searchTerm) {
            return response()->json([], 200);
        }

        $episodes = Episode::with('guest')
            ->where('naslov', 'like', '%' . $searchTerm . '%')
            ->orWhere('opis', 'like', '%' . $searchTerm . '%')
            ->orWhere('kljucneReci', 'like', '%' . $searchTerm . '%')
            ->get();

        return response()->json($episodes, 200);
    }

    // GET /api/episodes/{id} - Retrieve a specific episode
    public function show($id)
    {
        $episode = Episode::with('guest')->findOrFail($id);

        // Generate URL for the media file
        $mediaUrl = asset('storage/' . $episode->audio_video_path);

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
        $validated = $request->validate([
            'kljucneReci' => 'sometimes|string',
            'trajanje' => 'sometimes|integer',
            'opis' => 'sometimes|string',
            'datum' => 'sometimes|date',
            'naslov' => 'sometimes|string|max:255',
            'audio_video' => 'sometimes|file|mimes:mp3,mp4,wav|max:20480',
            'guest_id' => 'sometimes|exists:guests,id'
        ]);

        // Handle file update if a new file is uploaded
        if ($request->hasFile('audio_video')) {
            // Delete the existing file
            Storage::disk('public')->delete($episode->audio_video_path);

            // Store the new file
            $path = $request->file('audio_video')->store('episodes', 'public');
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
        Storage::disk('public')->delete($episode->audio_video_path);

        // Delete the episode record
        $episode->delete();

        return response()->json(['message' => 'Episode deleted successfully'], 200);
    }
}
