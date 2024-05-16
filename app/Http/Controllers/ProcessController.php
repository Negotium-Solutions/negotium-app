<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProcessController extends Controller
{
    public function index()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process?with=steps.activities');

        $responseData = json_decode($response->body());

        $processes = $responseData->data;

        $parameters = [
            'documents' => $processes
        ];

        return Inertia::render('Process/Index', $parameters);
    }
}
