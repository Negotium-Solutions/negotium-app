<?php

namespace App\Conversations;

use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;
use Illuminate\Support\Facades\Http;

class SelectProfileConversation extends Conversation
{
    public function askProfile()
    {
        $this->ask('What profile you are looking for?', function (Answer $answer) {
            $this->selectProfile(strtolower($answer->getText()));
        });
    }

    public function selectProfile($txt)
    {
        $this->bot->typesAndWaits(2);
        $user = $this->bot->userStorage()->find();
        $http = Http::withHeaders([
            'Authorization' => 'Bearer '. $user->get('token'),
            'Accept' => 'application/json'
        ]);
        $url = config('app.negotium_api_url').'/'.$user->get('tenant').'/profile?with=communications,schema,dynamicModel';
        $response = $http->get($url);
        $json = $response->body();
        //$this->say($url);
        $response_data = json_decode($json);

        $buttons = [
            // Button::create('Onboarding')->value('onboarding'),
            // Button::create('Another')->value('another'),
        ];

        if ($response_data->code === 200) {
            $profiles = $response_data->data;
            foreach ($profiles as $profile) {
                if (str_contains(strtolower($profile->profile_name), $txt) || strtolower($profile->email) === $txt) {
                    $buttons[] = Button::create($profile->profile_name)->value(json_encode($profile));
                }
            }
            //buttons[] = Button::create('Cancel')->value('stop');
        } else {
            $this->say('That didn\'t work :(');
        }

        

        $question = Question::create('Select profile...')
            ->callbackId('select_profile')
            ->addButtons($buttons);

        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->bot->userStorage()->save([
                    'profile' => $answer->getValue(),
                ]);

                $this->bot->typesAndWaits(2);
                $this->askAssign();
            }
        });
    }

    public function askAssign()
    {
        $user = $this->bot->userStorage()->find();
        $profile = json_decode($user->get('profile'));
        $process = json_decode($user->get('process'));

        $buttons = [
            Button::create('YES')->value('YES'),
            Button::create('NO')->value('NO'),
        ];
        $question = Question::create('Are you sure you want to Assign the process named '.$process->name.' from '.$profile->profile_name.'\'s profile?')
            ->callbackId('assign_process')
            ->addButtons($buttons);

        $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                if ($answer->getValue() === 'YES') {
                    $password = $answer->getText();
                    $this->bot->typesAndWaits(2);
                        
                    $user = $this->bot->userStorage()->find();
                    $profile = json_decode($user->get('profile'));
                    $process = json_decode($user->get('process'));

                    $url = config('app.negotium_api_url').'/'.$user->get('tenant').'/profile/assign-processes';
                    $data = '{ "data": [{ "profile_id": "'.$profile->id.'", "process_id": "'.$process->id.'" }] }';
                    $http = Http::withHeaders([
                        'Authorization' => 'Bearer '. $user->get('token'),
                        'Accept' => 'application/json'
                    ]);

                    $response = $http->post($url, json_decode($data));
                    $json = $response->body();
                    //$this->say($json);
                    $response_data = json_decode($json);
                    if ($response_data->code === 201 || $response_data->code === 200) {
                        $this->bot->startConversation(new OnboardingConversation());
                    } else {
                        $this->say('Oops!!!');
                    }
                    //$this->bot->startConversation(new OnboardingConversation());
                }

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
        $this->askProfile();
    }
}
