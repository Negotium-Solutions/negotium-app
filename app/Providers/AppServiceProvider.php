<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Symfony\Component\Yaml\Yaml;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $messages = Yaml::parseFile(config_path('messages.yaml'));
        config(['messages' => $messages]);

        // Load profiles/messages.yaml and merge it with the existing config
        $profileMessages = Yaml::parseFile(config_path('profile/messages.yaml'));
        config(['messages' => array_merge(config('messages'), $profileMessages)]);
    }
}
