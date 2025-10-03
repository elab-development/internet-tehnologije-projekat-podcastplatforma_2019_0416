<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SuggestionController extends Controller
{
    public function store(Request $request)
    {
        // Check if user is authenticated
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Morate biti prijavljeni da biste ostavili komentar.'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'comment' => 'required|string|min:5|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $suggestion = Suggestion::create([
            'comment' => $request->comment,
            'email' => auth()->user()->email
        ]);

        return response()->json([
            'message' => 'Hvala Vam! Potrudićemo se da usvojimo predloge i pohvale!',
            'suggestion' => $suggestion
        ], 201);
    }

    public function index(Request $request)
    {
        // Samo admini mogu da vide sugestije
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $suggestions = Suggestion::orderBy('created_at', 'desc')->get();

        return response()->json($suggestions);
    }

    public function exportPdf(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $suggestions = Suggestion::orderBy('created_at', 'desc')->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.suggestions', [
            'suggestions' => $suggestions,
            'date' => now()->format('d.m.Y.'),
            'total' => $suggestions->count()
        ]);

        return $pdf->download('suggestions-' . now()->format('Y-m-d') . '.pdf');
    }
}
