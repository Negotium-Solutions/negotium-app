<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;
use \Illuminate\Http\Client\PendingRequest as PendingRequest;

class ProfileController extends Controller
{
    private const PROFILES_KEY = 'profiles_';
    private const DYNAMIC_MODEL_TYPE_PROFILE = 1;
    private PendingRequest $http;
    private string $url;
    private string $apiImagesUrl;
    private array $profileData;
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
        $this->profileData = [];
        $this->profileData = $this->setProfilesData();
    }

    /**
     * Display the user's profile profile-details.
     */
    /**
     * Display the user's profile form.
     */
    public function create($schemaId = null): Response
    {
        $profileTypes = json_decode($this->http->get("{$this->url}/dynamic-model/schema/".self::DYNAMIC_MODEL_TYPE_PROFILE)->getBody(), true)['data'] ?? [];
        if ($schemaId === null) {
            $schemaId = isset($profileTypes[0]['id']) ? $profileTypes[0]['id'] : null;
        }
        $profile = json_decode($this->http->get("{$this->url}/dynamic-model/new-empty-record/{$schemaId}?with=groups.fields.validations,groups.fields.options")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profileTypes' => $profileTypes,
            'profile' => $profile,
            'schema_id' => $schemaId
        ];

        return Inertia::render('Profile/ProfileDetails/Create', $parameters);
    }

    /**
     * Display the user's profile form.
     */
    public function processes(Request $request, $id = null): Response
    {
        if ( (int)$id === 0) {
            $id = $this->profileData['profiles'][0]['id'];
        }

        if ($request->has('s_id') && $request->input('s_id') > 0) {
            $schema_id = $request->input('s_id');
        } else {
            $schema_id = $this->profileData['schemaId'];
        }

        $processes = json_decode($this->http->get("{$this->url}/process?with=groups")->getBody(), true)['data'] ?? [];
        $processCategories = json_decode($this->http->get($this->url.'/process-category')->getBody(), true)['data'];
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?schema_id={$schema_id}")->getBody(), true)['data'] ?? [];
        $profileProcesses = json_decode($this->http->get("{$this->url}/profile/{$id}/processes?schema_id={$schema_id}")->getBody(), true)['data'] ?? [];
// dd($profileProcesses);
        $assignedProcesses = [];
        foreach ($profileProcesses as $profileProcess) {
            $assignedProcesses[] = $profileProcess['process_id'];
        }

        $_processes = [];
        foreach ($processes as $process) {
            if (!in_array($process['id'], $assignedProcesses)) {
                $_processes[] = $process;
            }
        }

        $lookup = [
            'processes' => $_processes,
            'processCategories' => $processCategories
        ];

        $parameters = [
            'profileId' => $id,
            'profile' => $profile['models'][0],
            'profileProcesses' => $profileProcesses,
            'lookup' => $lookup
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Process/Index', $parameters);
    }

    /**
     * Display the user's profile profile-details.
     */
    /**
     * Display the user's profile form.
     */
    public function details(Request $request, $id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }

        if ($request->has('s_id') && $request->input('s_id') > 0) {
            $schema_id = $request->input('s_id');
        } else {
            $schema_id = $this->profileData['schemaId'];
        }

        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?schema_id={$schema_id}")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profileId' => $id,
            'profile' => $profile['models'][0],
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProfileDetails/Index', $parameters);
    }

    /**
     * Display the user's profile profile-details.
     */
    /**
     * Display the user's profile form.
     */
    public function editDetails($id): Response
    {
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=dynamicModel")->getBody(), true)['data'] ?? [];
        
        $parameters = [
            'profileId' => $id,
            'profile' => $profile['models'][0],
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProfileDetails/Edit', $parameters);
    }

    /**
     * Display the user's profile communications.
     */
    public function communications(Request $request, $id): Response
    {
        if ($request->has('s_id') && $request->input('s_id') > 0) {
            $schema_id = $request->input('s_id');
        } else {
            $schema_id = $this->profileData['schemaId'];
        }

        $communications = json_decode($this->http->get("{$this->url}/communication?profile_id={$id}&with=user,communicationType,status")->getBody(), true)['data'] ?? [];
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?schema_id={$schema_id}")->getBody(), true)['data'] ?? [];
        $communicationTypes = json_decode($this->http->get("{$this->url}/lookup", ["model" => "CommunicationType", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
          'communicationTypes' => $communicationTypes,
        ];

        $_profile = $profile['models'][0];
        $_profile['communications'] = $communications;

        $parameters = [
            'profileId' => $id,
            'profile' => $_profile,
            'lookup' => $lookup
        ];

        $parameters = array_merge($parameters, $this->profileData);

        // dd($parameters);

        return Inertia::render('Profile/Communications/Index', $parameters);
    }

    public function notes($id): Response
    {
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=notes.user")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profileId' => $id,
            'profile' => $profile['models'][0]
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Notes/Index', $parameters);
    }

    public function documents($id): Response
    {
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=documents.user")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profileId' => $id,
            'profile' => $profile['models'][0]
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Documents/Index', $parameters);
    }

    public function setProfilesData() : array
    {
        $key = self::PROFILES_KEY.Auth::user()->id;
        // Disable validation until caching is required
        if (true/*$this->request->has('cache') && $this->request->cache === 'clear'*/) {
            Cache::store('redis')->forget($key);
        }

        if (!Cache::has($key)) {
            $profileTypes = json_decode($this->http->get("{$this->url}/dynamic-model/schema/".self::DYNAMIC_MODEL_TYPE_PROFILE)->getBody(), true)['data'] ?? [];
            Cache::store('redis')->put($key, $profileTypes, 86400);
        }

        $profileTypes = Cache::store('redis')->get($key) ?? [];

        $schemaId = $this->request->has('s_id') && $this->request->input('s_id') > 0 ? $this->request->input('s_id') : null;
        if (!isset($schemaId)) {
            $schemaId = isset($profileTypes[0]['id']) ? $profileTypes[0]['id'] : null;
        }
        $profiles = json_decode($this->http->get("{$this->url}/profile?schema_id={$schemaId}")->getBody(), true)['data'] ?? [];

        return [
            'profileTypes' => $profileTypes,
            'profiles' => $profiles['models'],
            'schemaId' => $schemaId,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];
    }
}
