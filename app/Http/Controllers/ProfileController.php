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
    private const PROFILES_KEY = 'profiles';
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
    public function create($id): Response
    {
        $profile = json_decode($this->http->get("{$this->url}/profile/schema/{$id}")->getBody(), true)['data'] ?? [];
        $profile['profile_type_id'] = $id;
        // dd($profile);
        $parameters = [
            'profile' => $profile,
            'profile_type_id' => $id,
        ];

        return Inertia::render('Profile/ProfileDetails/Create', $parameters);
    }

    /**
     * Display the user's profile form.
     */
    public function processes($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }
        $processes = json_decode($this->http->get($this->url.'/process?with=category,steps.activities')->getBody(), true)['data'];
        $processCategories = json_decode($this->http->get($this->url.'/process-category')->getBody(), true)['data'];
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=processes.log.step,processes.log.status")->getBody(), true)['data'] ?? [];

        $lookup = [
            'processes' => $processes,
            'processCategories' => $processCategories
        ];

        $parameters = [
            'profile' => $profile,
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
    public function details($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }

        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=dynamicModel")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile
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
    public function editDetails($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=dynamicModel")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile,
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProfileDetails/Edit', $parameters);
    }

    /**
     * Display the user's profile communications.
     */
    public function communications($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}/?with=communications.user,communications.communicationType,communications.status")->getBody(), true)['data'] ?? [];
        $communicationTypes = json_decode($this->http->get("{$this->url}/lookup", ["model" => "CommunicationType", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
          'communicationTypes' => $communicationTypes,
        ];

        $parameters = [
            'profile' => $profile,
            'lookup' => $lookup
        ];

        $parameters = array_merge($parameters, $this->profileData);
        return Inertia::render('Profile/Communications/Index', $parameters);
    }

    public function notes($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=notes.user")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Notes/Index', $parameters);
    }

    public function documents($id = null): Response
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }
        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=documents.user")->getBody(), true)['data'] ?? [];

        $parameters = [
            'profile' => $profile
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Documents/Index', $parameters);
    }

    public function setProfilesData() : array
    {
        // Disable validation until caching is required
        if (true/*$this->request->has('cache') && $this->request->cache === 'clear'*/) {
            Cache::store('redis')->forget(self::PROFILES_KEY);
        }

        if (!Cache::has(self::PROFILES_KEY)) {
            $response = json_decode($this->http->get($this->url.'/profile-type?with=profiles')->getBody(), true)['data'];
            Cache::store('redis')->put(self::PROFILES_KEY, $response, 86400);
        }

        $profileTypes = Cache::store('redis')->get(self::PROFILES_KEY) ?? [];
        $profileTypeId = $this->request->has('pt') && ($this->request->input('pt') > 0) ? $this->request->input('pt') : null;
        if(!isset($profileTypeId)) {
            $profileTypeId = $profileTypes[0]['id'];
        }
        if(!isset($id)) {
            $id = $profileTypes[0]['profiles'][0]['id'];
        }

        return [
            'profileTypes' => $profileTypes,
            'profileTypeId' => $profileTypeId,
            'profileId' => $id,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];
    }
}
