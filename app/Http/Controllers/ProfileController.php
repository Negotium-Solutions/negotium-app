<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use \Illuminate\Http\Client\PendingRequest as PendingRequest;

class ProfileController extends Controller
{
    private const PROFILES_KEY = 'profiles';
    private const NAVIGATION_PROCESSES = 'processes';
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
        $this->profileData = $this->setProfilesData();
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
            'lookup' => $lookup,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/Process/Index', $parameters);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /**
     * Display the user's profile details.
     */
    /**
     * Display the user's profile form.
     */
    public function details($id = null): Response
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
            'lookup' => $lookup,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProfileDetails/Index', $parameters);
    }

    /**
     * Display the user's profile details.
     */
    /**
     * Display the user's profile form.
     */
    public function editDetails($id = null): Response
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
            'lookup' => $lookup,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProfileDetails/Edit', $parameters);
    }

    /**
     * Display the user's profile communications.
     */
    public function communications(Request $request): Response
    {
        $responseProfileTypes = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ])->get(env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant.'/profile-type?with=profiles.processes.log.status,profiles.processes.log.step,profiles.documents');

        $profileTypes = isset(json_decode($responseProfileTypes->body(), true)['data']) ? json_decode($responseProfileTypes->body(), true)['data'] : [];

        $parameters = [
            'profileTypes' => $profileTypes,
            'api_url' => env('NEGOTIUM_IMAGES_URL')
        ];

        return Inertia::render('Profile/Index', $parameters);
    }

    public function getProfilesData($id, $profileTypeId, $navigation) : array
    {
        Cache::store('redis')->forget(self::PROFILES_KEY);
        if (!Cache::has(self::PROFILES_KEY)) {
            $response = json_decode($this->http->get($this->url.'/profile-type?with=profiles')->getBody(), true)['data'];
            Cache::store('redis')->put(self::PROFILES_KEY, $response, 86400);
        }

        $with = '';
        switch ($navigation) {
            case self::NAVIGATION_PROCESSES:
                $navigationProcesses = self::NAVIGATION_PROCESSES;
                $with .= "{$navigationProcesses}.log.step,{$navigationProcesses}.log.status";
            break;
        }

        $profileTypes = Cache::store('redis')->get(self::PROFILES_KEY) ?? [];
        if(!isset($profileTypeId)) {
            $profileTypeId = $profileTypes[0]['id'];
        }

        if(!isset($id)) {
            $id = $profileTypes[0]['profiles'][0]['id'];
        }

        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with={$with}")->getBody(), true)['data'] ?? [];

        return [
            'profileTypes' => $profileTypes,
            'profile' => $profile,
            'profileTypeId' => $profileTypeId
        ];
    }

    public function setProfilesData() : array
    {
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
            'profileId' => $id
        ];
    }
}
