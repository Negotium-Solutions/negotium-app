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

    private const DYNAMIC_MODEL_TYPE_PROFILE = 1;

    public function __construct(Request $request)
    {
        $this->http = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ]);
        $this->url = config('negotium_api_url').'/'.Auth::user()->tenant;
        $this->apiUrl = config('negotium_api_url');
        $this->apiImagesUrl = config('negotium_images_url');
        $this->request = $request;
    }

    public function index()
    {
        $profiles = json_decode($this->http->get("{$this->url}/dynamic-model/schema/".self::DYNAMIC_MODEL_TYPE_PROFILE)->getBody(), true)['data'] ?? [];

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

    public function edit($id, $profile_category_id, $quick_capture)
    {
        $profile = json_decode($this->http->get("{$this->url}/schema/{$id}?with=steps")->getBody(), true)['data'] ?? [];
        $categoryTypes = json_decode($this->http->get("{$this->url}/dynamic-model-category?dynamic_model_type_id=1")->getBody(), true)['data'] ?? [];
        $profileCategory = json_decode($this->http->get("{$this->url}/dynamic-model-category/{$profile_category_id}?with=templates&dynamic_model_type_id=1")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile,
            'categoryTypes' => $categoryTypes,
            'profileCategory' => $profileCategory,
            'profile_category_id' => $profile_category_id,
            'quick_capture' => $quick_capture
        ];

        return Inertia::render('Admin/ProfileCreation/Edit', $parameters);
    }

    public function editInput($id, $profile_category_id, $quick_capture)
    {
        $profile = json_decode($this->http->get("{$this->url}/schema/{$id}?with=steps.fields")->getBody(), true)['data'] ?? [];
        $categoryTypes = json_decode($this->http->get("{$this->url}/dynamic-model-category?dynamic_model_type_id=1")->getBody(), true)['data'] ?? [];
        $profileCategory = json_decode($this->http->get("{$this->url}/dynamic-model-category/{$profile_category_id}?with=templates&dynamic_model_type_id=1")->getBody(), true)['data'] ?? [];
    // dd($profile);
        $parameters = [
            'profile' => $profile,
            'categoryTypes' => $categoryTypes,
            'profileCategory' => $profileCategory,
            'profile_category_id' => $profile_category_id,
            'quick_capture' => $quick_capture
        ];

        return Inertia::render('Admin/ProfileCreation/EditInput', $parameters);
    }
}
