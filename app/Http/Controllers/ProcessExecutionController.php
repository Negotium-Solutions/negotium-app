<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\PendingRequest as PendingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProcessExecutionController extends Controller
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
        $this->profileData = $this->setProfilesData();
    }

    public function edit($id, $process_id, $step_id = null)
    {
        if((int)$id === 0 || $id === null){
            $id = $this->profileData['profileId'];
        }

        $profile = json_decode($this->http->get("{$this->url}/profile/{$id}?with=dynamicModel")->getBody(), true)['data'] ?? [];
        $process = json_decode($this->http->get("{$this->url}/process-execution?with=&profile_id={$id}&process_id={$process_id}")->getBody(), true)['data'] ?? [];

        if ($step_id !== null && $step_id > 0) {
            $process['step_id'] = (int)$step_id;
        }

        $parameters = [
            'profile' => $profile,
            'process' => $process,
            'step_id' => $step_id
        ];

        $parameters = array_merge($parameters, $this->profileData);

        return Inertia::render('Profile/ProcessExecution/Edit', $parameters);
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
