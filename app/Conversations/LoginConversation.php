<?php

namespace App\Conversations;

use Validator;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;
use Illuminate\Support\Facades\Http;

class LoginConversation extends Conversation
{
    public function askUsername()
    {
        $this->say('You need to login...');
        $this->bot->typesAndWaits(2);

        $this->ask('What is your email?', function (Answer $answer) {
            $validator = Validator::make(['email' => $answer->getText()], [
                'email' => 'email',
            ]);

            if ($validator->fails()) {
                return $this->repeat('That doesn\'t look like a valid email. Please enter a valid email.');
            }

            $this->bot->userStorage()->save([
                'email' => $answer->getText(),
            ]);

            $this->askPassword();
        });
    }

    public function askPassword()
    {
        $this->ask('And your password?', function (Answer $answer) {
            $password = $answer->getText();
            $this->bot->typesAndWaits(2);
                
            $user = $this->bot->userStorage()->find();

            $response = Http::post(env('NEGOTIUM_API_URL').'/auth/signin', [
                'email' => $user->get('email'),
                'password' => $password,
            ]);
    
            $response_data = json_decode($response->body());
    
            if ($response_data->code === 200) {
            
                $this->bot->userStorage()->save([
                    'token' => $response_data->data->token,
                    'tenant' => $response_data->data->tenant,
                ]);

                $this->say('Thank you ');

                $this->bot->startConversation(new SelectProcessConversation());
            } else {
                $this->say('That didn\'t work :(');
            }
        });
    }

    /**
     * Start the conversation.
     *
     * @return mixed
     */
    public function run()
    {
        $this->askUsername();
    }
}
