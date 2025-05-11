<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;
use Illuminate\Support\Facades\Http;

class SelectProcessConversation extends Conversation
{
    public function askProcess()
    {
        $this->ask('What process you are looking for?', function (Answer $answer) {
            $this->selectProcess(strtolower($answer->getText()));
        });
    }

    public function selectProcess($txt)
    {
        $this->bot->typesAndWaits(2);
        $user = $this->bot->userStorage()->find();
        $http = Http::withHeaders([
            'Authorization' => 'Bearer '. $user->get('token'),
            'Accept' => 'application/json'
        ]);
        $url = config('negotium_api_url').'/'.$user->get('tenant').'/process';
        $response = $http->get($url);
        $json = $response->body();
        //$this->say($url);
        $response_data = json_decode($json);

        $buttons = [
            // Button::create('Onboarding')->value('onboarding'),
            // Button::create('Another')->value('another'),
        ];
$this->say($json);

        if (isset($response_data->code) && $response_data->code === 200) {
            //$this->say($txt);
            $processes = $response_data->data;
            foreach ($processes as $process) {
                if (str_contains(strtolower($process->name), $txt)) {// === 'Client Onboarding') {
                    $buttons[] = Button::create($process->name)->value(json_encode($process));
                }
            }
            //buttons[] = Button::create('Cancel')->value('stop');
        } else {
            $this->say('That didn\'t work :(');
        }

        

        $question = Question::create('Select process...')
            ->callbackId('select_process')
            ->addButtons($buttons);

        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->bot->userStorage()->save([
                    'process' => $answer->getValue(),
                ]);

                $this->bot->startConversation(new SelectProfileConversation());
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
        $this->askProcess();
    }
}
