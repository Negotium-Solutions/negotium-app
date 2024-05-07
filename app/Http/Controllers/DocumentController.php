<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index()
    {
        // env('API_URL')
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get('http://localhost/api/'.Auth::user()->tenant.'/document');

        $responseData = json_decode($response->body());

        $documents = $responseData->data;

        $parameters = [
            'documents' => $documents
        ];

        return Inertia::render('Document/Index', $parameters);
    }

    public function create()
    {
        $parameters = [
            'api_url' => config('app.env.API_URL')
        ];

        return Inertia::render('Document/Create', $parameters);
    }
}
