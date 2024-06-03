<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

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
        @if ( !in_array(request()->route()->getName(), [null, 'login' , 'register', 'forgot.request']) )
            @vite(['resources/js/app.js', "resources/js/Pages/{$page['component']}.vue"])
        @else
            @vite(['resources/js/app_tailwind.js', "resources/js/Pages/{$page['component']}.vue"])
        @endif
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
    </body>
</html>
