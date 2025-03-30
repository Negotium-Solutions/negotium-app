<?php

namespace App\Http\Controllers;

use BotMan\BotMan\BotMan;
use App\Conversations\ExampleConversation;

class BotManController extends Controller
{
    /**
     * Place your BotMan logic here.
     */
    public function handle()
    {
        $botman = app('botman');
        
        //$botman->userStorage()->delete();

        //$botman->hears('.*', BotManController::class.'@startConversation');
        $botman->hears('{message}', function ($botman, $message) {
            $botman->typesAndWaits(2);
            if (strtolower($message) == 'hi' || strtolower($message) == 'hello') {
                $botman->startConversation(new ExampleConversation);
            } else if (strtolower($message) == 'bye' || strtolower($message) == 'quit') {
                $botman->userStorage()->delete();
                $botman->reply("Start the conversation using 'hi' or 'hello'...");
            } else {
                $botman->reply("Start the conversation using 'hi' or 'hello'...");
            }
        });

        $botman->listen();
    }

    /**
     * Loaded through routes/botman.php
     * @param  BotMan $bot
     */
    public function startConversation(BotMan $bot)
    {
        $bot->startConversation(new ExampleConversation());
    }
}
