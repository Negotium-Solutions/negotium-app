<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <!-- Fonts -->
        <!-- Google Font: Source Sans Pro -->
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback">
        <!-- Font Awesome Icons -->
        <link rel="stylesheet" href="{{asset('adminlte/plugins/fontawesome-free/css/all.min.css')}}">
        <!-- Theme style -->
        <link rel="stylesheet" href="{{asset('adminlte/dist/css/adminlte.min.css')}}">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Young+Serif">

        <!-- Scripts -->
        @routes
        <!-- TODO: remove the else part after creating the auth pages -->
        @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @inertiaHead
    </head>
    <body class="hold-transition sidebar-mini">
        @inertia

        <!-- REQUIRED SCRIPTS -->
        <!-- jQuery -->
        <script src="{{asset('adminlte/plugins/jquery/jquery.min.js')}}"></script>
        <!-- Bootstrap -->
        <script src="{{asset('adminlte/plugins/bootstrap/js/bootstrap.bundle.min.js')}}"></script>
        <!-- AdminLTE -->
        <script src="{{asset('adminlte/dist/js/adminlte.js')}}"></script>
        <link rel="stylesheet" type="text/css" href="{{ asset('assets/css/chat.min.css') }}">
@auth
@php
    $isLocal = request()->getHost() == 'localhost';
    $botmanUrl = $isLocal ? url('/botman') : '';
    $botmanFrame = $isLocal ? url('/botman/chat') : '';
@endphp

<script>
    // Check if botmanFrame and botmanUrl are not empty strings
    if ("{{ $botmanFrame }}" !== "" && "{{ $botmanUrl }}" !== "") {
        var botmanWidget = {
            frameEndpoint: "{{ $botmanFrame }}",
            chatServer: "{{ $botmanUrl }}",
            aboutText: 'Reference :- negotium-solutions.com',
            introMessage: "✋ Hi! I'm Negotium's Chatbot",
        };
    } else {
        var botmanWidget = {
            aboutText: 'Reference :- negotium-solutions.com',
            introMessage: "✋ Hi! I'm Negotium's Chatbot",
        };
    }
    
</script>


<script src='{{ asset('assets/js/widget.js') }}'></script>
@endauth
    </body>
</html>
