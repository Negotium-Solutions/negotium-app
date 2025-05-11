<?php

namespace App\Conversations;

use Illuminate\Foundation\Inspiring;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;
use Illuminate\Support\Facades\Auth;

class ExampleConversation extends Conversation
{
    /**
     * First question
     */
    public function askReason()
    {
        
        // temp... remove!!!
        $this->bot->userStorage()->save([
            'token' => Auth::user()->token,
            'tenant' => Auth::user()->tenant,
        ]);
        
        $question = Question::create("How can I help?")
            ->fallback('Unable to ask question')
            ->callbackId('ask_reason')
            ->addButtons([
                Button::create('Start a process')->value('process'),
                Button::create('Something else')->value('else'),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                if ($answer->getValue() === 'process') {
                    $user = $this->bot->userStorage()->find();
                    //$this->say(null !== $user->get('token')? 'something': 'null');
                    if (null === $user->get('token') || null === $user->get('tenant') || $user->get('token') === '' || $user->get('tenant') === '') {
                        $this->bot->startConversation(new LoginConversation());
                    } else {
                        $this->bot->startConversation(new SelectProcessConversation());
                    }
                } else {
                    $this->say('Something :)');
                }
            }
        });
    }

    /**
     * Start the conversation
     */
    public function run()
    {
        $this->askReason();
    }
}
