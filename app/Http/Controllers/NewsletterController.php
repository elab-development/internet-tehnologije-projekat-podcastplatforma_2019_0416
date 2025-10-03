<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:newsletter_subscribers,email'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $subscriber = NewsletterSubscriber::create([
            'email' => $request->email,
            'is_active' => true
        ]);

        return response()->json([
            'message' => 'Uspešno ste se prijavili na newsletter!',
            'subscriber' => $subscriber
        ], 201);
    }

    public function index(Request $request)
    {
        
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($subscribers);
    }

    public function exportPdf(Request $request)
    {
        if (!$request->user() || !$request->user()->is_admin) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $subscribers = NewsletterSubscriber::where('is_active', true)
            ->orderBy('created_at', 'desc')
            ->get();

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.newsletter-subscribers', [
            'subscribers' => $subscribers,
            'date' => now()->format('d.m.Y.'),
            'total' => $subscribers->count()
        ]);

        return $pdf->download('newsletter-subscribers-' . now()->format('Y-m-d') . '.pdf');
    }
}
