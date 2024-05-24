<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <!-- Scripts -->
        @routes
        <!-- TODO: remove the else part after creating the auth pages -->
        @if ( !in_array(request()->route()->getName(), [null, 'login' , 'register', 'forgot.request']) )
            @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @else
            @vite(['resources/js/app_tailwind.js', "resources/js/Pages/{$page['component']}.vue"])
        @endif
        @inertiaHead
    </head>
    <body class="hold-transition sidebar-mini" style="margin: 0px;">
        @inertia
    </body>
</html>
