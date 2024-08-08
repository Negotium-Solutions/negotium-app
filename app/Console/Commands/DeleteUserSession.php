<?php

namespace App\Console\Commands;

use GuzzleHttp\Psr7\Request;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DeleteUserSession extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:logout';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Deletes the user session, helps when the database for the api has been refresh';

    public function __construct() {
        parent::__construct();
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Deleting user sessions");
        // Delete the sessions
        $sessions = DB::table('sessions')->get();

        foreach ($sessions as $session) {
            DB::table('sessions')->where('id', $session->id)->delete();

            Auth::guard('web')->logout();
        }
    }
}
