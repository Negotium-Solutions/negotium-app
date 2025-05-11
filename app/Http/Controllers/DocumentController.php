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
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(config('negotium_api_url').'/'.Auth::user()->tenant.'/document');

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

    public function edit($id)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(config('negotium_api_url').'/'.Auth::user()->tenant.'/document/'.$id);

        $responseData = json_decode($response->body());

        $document = $responseData->data;

        $parameters = [
            'doc' => $document
        ];

        return Inertia::render('Document/Edit', $parameters);
    }
}
