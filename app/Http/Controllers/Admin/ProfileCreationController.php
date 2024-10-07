<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\PendingRequest as PendingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProfileCreationController extends Controller
{
    private PendingRequest $http;
    private string $url;
    private string $apiImagesUrl;
    private Request $request;

    public function __construct(Request $request)
    {
        $this->http = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ]);
        $this->url = env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant;
        $this->apiUrl = env('NEGOTIUM_API_URL');
        $this->apiImagesUrl = env('NEGOTIUM_IMAGES_URL');
        $this->request = $request;
    }

    public function index()
    {
        $profiles = json_decode($this->http->get("{$this->url}/dynamic-model?type_id=1")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profiles' => $profiles
        ];

        return Inertia::render('Admin/ProfileCreation/Index', $parameters);
    }

    public function create()
    {
        $profiles = json_decode($this->http->get("{$this->url}/dynamic-model?type_id=1")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profiles' => $profiles
        ];

        return Inertia::render('Admin/ProfileCreation/Create', $parameters);
    }

    public function edit($id)
    {
        $profile = json_decode($this->http->get("{$this->url}/schema/{$id}?with=steps")->getBody(), true)['data'] ?? [];
        $profileCategories = json_decode($this->http->get("{$this->url}/dynamic-model-category?with=templates&dynamic_model_type_id=1")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile,
            'profileCategories' => $profileCategories
        ];

        return Inertia::render('Admin/ProfileCreation/Edit', $parameters);
    }
}
