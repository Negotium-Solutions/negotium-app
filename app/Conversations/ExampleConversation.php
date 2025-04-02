<?php

namespace App\Conversations;

use Illuminate\Foundation\Inspiring;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;

class ExampleConversation extends Conversation
{
    /**
     * First question
     */
    public function askReason()
    {
        
        // temp... remove!!!
        $this->bot->userStorage()->save([
            'token' => '27|jvUEjmX9vB9mK81gZbzP7ijyNjjxqmBAVJVrEavAab9c04f3',
            'tenant' => '354721dc-c7bf-4d46-9650-c44939f7875e',
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
