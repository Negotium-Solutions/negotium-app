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
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/client-type?with=schema');

        $responseData = json_decode($response->body(), true);

        $profileTypes = $responseData['data'];

        foreach ($profileTypes as $key => $profileType) {
            $profileTypes[$key] = $profileType;
            $profileTypes[$key]['schema']['columns'] = isset($profileType['schema']['columns']) ? json_decode($profileType['schema']['columns']) : [];
        }

        $parameters = [
            'profileTypes' => $profileTypes
        ];

        return Inertia::render('Admin/ProfileManager/Index', $parameters);
    }
}
