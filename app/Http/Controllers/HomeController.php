<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function example() {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/document');

        $responseData = json_decode($response->body());

        $documents = $responseData->data;

        $parameters = [
            'documents' => $documents
        ];

        return Inertia::render('Example/Index', $parameters);
    }
}
