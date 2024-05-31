<?php

namespace App\Http\Controllers;

use App\definitions\ModelTypeDefinitions;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class StepController extends Controller
{
    public function create($process_id)
    {
        $processResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process/'.$process_id.'?with=category,steps');

        $processResponseData = json_decode($processResponse->body(), true);

        $process = $processResponseData['data'];

        $parameters = [
            'process' => $process,
            'model_id' => ModelTypeDefinitions::PROCESS,
            'parent_id' => $process_id
        ];

        return Inertia::render('Step/Create', $parameters);
    }
}
