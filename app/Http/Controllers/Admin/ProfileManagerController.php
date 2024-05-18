<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProfileManagerController extends Controller
{
    public function index()
    {
        $response = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/client-type?with=steps.activities');

        $responseData = json_decode($response->body(), true);

        $profileTypes = $responseData['data'];

        foreach ($profileTypes as $key => $profileType) {
            foreach ($profileType['steps'] as $step_key => $step ) {
                $profileType['steps'][$step_key]['activities']['columns'] = isset($step['activities']['columns']) ? json_decode($step['activities']['columns'], true) : [];
            }
            $profileTypes[$key] = $profileType;
        }

        $parameters = [
            'profileTypes' => collect($profileTypes)
        ];

        return Inertia::render('Admin/ProfileManager/Index', $parameters);
    }
}
