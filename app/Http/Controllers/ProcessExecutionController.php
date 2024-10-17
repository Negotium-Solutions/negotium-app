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
        $this->profileData = $this->setProfilesData();
    }

    public function edit(Request $request, $id, $profile_id, $process_id, $step_id = null)
    {
        if((int)$id === 0 || $id === null){
            $profile_id = $this->profileData['profileId'];
        }

        $profile = json_decode($this->http->get("{$this->url}/profile/{$profile_id}?schema_id={$request->input('s_id')}")->getBody(), true)['data'] ?? [];
        $process = json_decode($this->http->get("{$this->url}/process-execution/{$id}?profile_id={$profile_id}&process_id={$process_id}&schema_id={$request->input('s_id')}")->getBody(), true)['data'] ?? [];
dd($process);
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

        if(!isset($id)) {
            $id = $profiles['models'][0]['id'];
        }

        return [
            'profileTypes' => $profileTypes,
            'profiles' => $profiles['models'],
            'schemaId' => $schemaId,
            'profileId' => $id,
            'apiUrl' => $this->apiUrl,
            'apiImagesUrl' => $this->apiImagesUrl
        ];
    }
}
