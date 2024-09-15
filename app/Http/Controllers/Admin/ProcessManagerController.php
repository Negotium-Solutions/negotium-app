<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProcessManager;
use Illuminate\Http\Client\PendingRequest as PendingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ProcessManagerController extends Controller
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

    public function index(Request $request)
    {
        $processes = json_decode($this->http->get("{$this->url}/process?with=category,steps.activities")->getBody(), true)['data'] ?? [];
        $categories = json_decode($this->http->get("{$this->url}/lookup", ["model" => "ProcessCategory", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'lookup' => $lookup,
            'processes' => $processes
        ];

        return Inertia::render('Admin/ProcessManager/Index', $parameters);
    }

    public function create()
    {
        $categories = json_decode($this->http->get("{$this->url}/lookup", ["model" => "ProcessCategory", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'lookup' => $lookup
        ];

        return Inertia::render('Admin/ProcessManager/Create', $parameters);
    }

    public function edit($process_id)
    {
        $process = json_decode($this->http->get("{$this->url}/process/{$process_id}")->getBody(), true)['data'] ?? [];
        $categories = json_decode($this->http->get("{$this->url}/lookup", ["model" => "ProcessCategory", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'process' => $process,
            'lookup' => $lookup
        ];

        return Inertia::render('Admin/ProcessManager/Edit', $parameters);
    }
}
