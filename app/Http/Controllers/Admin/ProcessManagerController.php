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
        $this->url = config('negotium_api_url').'/'.Auth::user()->tenant;
        $this->apiUrl = config('negotium_api_url');
        $this->apiImagesUrl = config('negotium_images_url');
        $this->request = $request;
    }

    public function index(Request $request)
    {
        $processes = json_decode($this->http->get("{$this->url}/process?with=groups")->getBody(), true)['data'] ?? [];
        $categories = json_decode($this->http->get($this->url.'/process-category')->getBody(), true)['data'];

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
        $categories = json_decode($this->http->get($this->url.'/process-category')->getBody(), true)['data'];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'lookup' => $lookup
        ];

        return Inertia::render('Admin/ProcessManager/Create', $parameters);
    }

    public function edit($process_id, $step_id = null)
    {
        $dynamicModelFieldTypeGroup = json_decode($this->http->get("{$this->url}/dynamic-model-field-type-group?with=field_types")->getBody(), true)['data'] ?? [];
        // $process = json_decode($this->http->get("{$this->url}/process/{$process_id}?with=steps.activities.field_type")->getBody(), true)['data'] ?? [];
        $process = json_decode($this->http->get("{$this->url}/process/{$process_id}?with=groups")->getBody(), true)['data'] ?? [];
        $categories = json_decode($this->http->get("{$this->url}/lookup", ["model" => "ProcessCategory", "object" => 1])->getBody(), true)['data'] ?? [];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'process' => $process,
            'lookup' => $lookup,
            'dynamicModelFieldTypeGroup' => $dynamicModelFieldTypeGroup,
            'step_id' => $step_id
        ];

        return Inertia::render('Admin/ProcessManager/Edit', $parameters);
    }

    public function editActivity($process_id, $step_id = null)
    {
        $dynamicModelFieldTypeGroup = json_decode($this->http->get("{$this->url}/dynamic-model-field-type-group?with=field_types")->getBody(), true)['data'] ?? [];
        $process = json_decode($this->http->get("{$this->url}/process/{$process_id}?with=groups.fields.field_type")->getBody(), true)['data'] ?? [];
        // $process = json_decode($this->http->get("{$this->url}/process/{$process_id}?with=steps.activities.field_type")->getBody(), true)['data'] ?? [];
        // $categories = json_decode($this->http->get("{$this->url}/lookup", ["model" => "ProcessCategory", "object" => 1])->getBody(), true)['data'] ?? [];
        $categories = json_decode($this->http->get($this->url.'/process-category')->getBody(), true)['data'];

        $lookup = [
            'categories' => $categories,
        ];

        $parameters = [
            'process' => $process,
            'lookup' => $lookup,
            'dynamicModelFieldTypeGroup' => $dynamicModelFieldTypeGroup,
            'step_id' => $step_id
        ];

        // dd($parameters);

        return Inertia::render('Admin/ProcessManager/EditActivity', $parameters);
    }
}
