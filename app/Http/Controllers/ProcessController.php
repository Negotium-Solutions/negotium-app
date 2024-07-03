<?php

namespace App\Http\Controllers;

use App\definitions\ModelTypeDefinitions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProcessController extends Controller
{
    public function index(Request $request)
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process?with=category,steps.activities');

        $categoriesResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process-category');

        $categoriesResponseData = json_decode($categoriesResponse->body(), true);
        $responseData = json_decode($response->body(), true);

        $categories = $categoriesResponseData['data'];
        $processes = $responseData['data'];
        
        $parameters = [
            'categories' => collect($categories),
            'processes' => collect($processes)
        ];

        return Inertia::render('Process/Index', $parameters);
    }

    public function create()
    {
        $categoriesResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process-category');

        $formsResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/form?forms=1|2|3|4&with=steps.activities'); // TODO: Create constants for Category = 1, Process = 2, Step = 3, Activity = 4

        $categoriesResponseData = json_decode($categoriesResponse->body(), true);
        $formsResponseData = json_decode($formsResponse->body(), true);

        $categories = $categoriesResponseData['data'];
        $forms = $formsResponseData;
        dd($forms);

        $parameters = [
            'categories' => $categories,
            'forms' => $forms
        ];

        return Inertia::render('Process/Create', $parameters);
    }

    public function edit($id, $step_id = null)
    {
        $processResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/process/'.$id.'?with=category,steps.activities');

        $activityGroupsResponse = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/activity-group?with=activity_types');

        $processResponseData = json_decode($processResponse->body(), true);
        $activityGroupsResponseData = json_decode($activityGroupsResponse->body(), true);

        $process = $processResponseData['data'];
        $activityGroups = $activityGroupsResponseData['data'];

        $parameters = [
            'process' => $process,
            'model_id' => ModelTypeDefinitions::PROCESS,
            'step_id' => $step_id ?? 0,
            'activity_groups' => $activityGroups
        ];

        return Inertia::render('Process/Edit', $parameters);
    }
}
