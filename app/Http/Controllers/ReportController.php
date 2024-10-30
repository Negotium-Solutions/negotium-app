<?php

namespace App\Http\Controllers;


use Illuminate\Http\Client\PendingRequest as PendingRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ReportController extends Controller
{
    private PendingRequest $http;
    private string $url;

    public function __construct(Request $request)
    {
        $this->http = Http::withHeaders([
            'Authorization' => 'Bearer '. Auth::user()->token,
            'Accept' => 'application/json'
        ]);
        $this->url = env('NEGOTIUM_API_URL').'/'.Auth::user()->tenant;
        $this->request = $request;
    }

    public function index($profileTypeId = null)
    {
        $processStatusReport = json_decode($this->http->get("{$this->url}/report/process-status/{$profileTypeId}")->getBody(), true)['data'] ?? [];

        $parameters = [
            'processStatusReport' => $processStatusReport
        ];

        return Inertia::render('Report/Index', $parameters);
    }
}
