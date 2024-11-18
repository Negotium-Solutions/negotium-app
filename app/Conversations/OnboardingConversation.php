<?php

namespace App\Conversations;

use Validator;
use BotMan\BotMan\Messages\Incoming\Answer;
use BotMan\BotMan\Messages\Outgoing\Question;
use BotMan\BotMan\Messages\Outgoing\Actions\Button;
use BotMan\BotMan\Messages\Conversations\Conversation;

class OnboardingConversation extends Conversation
{
    public function askLeadConfirmed()
    {
        $question = Question::create("Lead confirmed?")
            ->fallback('Unable to ask question')
            ->callbackId('ask_leadConfirmed')
            ->addButtons([
                Button::create('YES')->value('YES'),
                Button::create('NO')->value('NO'),
                Button::create('IN PROGRESS')->value('IN_PROGRESS'),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->bot->userStorage()->save([
                    'leadConfirmed' => $answer->getText(),
                ]);
                $this->askLeadOrigin();
            }
        });
        // $this->ask('Lead confirmed?', function (Answer $answer) {
            // $this->bot->userStorage()->save([
            //     'leadConfirmed' => $answer->getText(),
            // ]);
            // $this->askLeadOrigin();
        // });
    }

    public function askLeadOrigin()
    {
        $this->ask('Lead origin?', function (Answer $answer) {
            $this->bot->userStorage()->save([
                'leadOrigin' => $answer->getText(),
            ]);

            $this->say('Thank you ');

            $this->askApprovalSigned();
        });
    }

    public function askApprovalSigned()
    {
        $question = Question::create("Authorisation letter signed per?")
            ->fallback('Unable to ask question')
            ->callbackId('ask_authorisationLetterSigned')
            ->addButtons([
                Button::create('Docusign')->value('Docusign'),
                Button::create('Physical')->value('NO'),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->bot->userStorage()->save([
                    'authorisationLetterSigned' => $answer->getText(),
                ]);
                $this->askApprovalOutcome();
            }
        });
    }

    public function askApprovalOutcome()
    {
        $question = Question::create("Approval outcome?")
            ->fallback('Unable to ask question')
            ->callbackId('ask_approvalOutcome')
            ->addButtons([
                Button::create('APPROVED')->value('APPROVED'),
                Button::create('DECLINED')->value('DECLINED'),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                $this->bot->userStorage()->save([
                    'approvalOutcome' => $answer->getText(),
                ]);

                $this->askComplete();
            }
        });
    }

    public function askComplete()
    {
        $question = Question::create("Complete process?")
            ->fallback('Unable to ask question')
            ->callbackId('ask_complete')
            ->addButtons([
                Button::create('YES')->value('YES'),
                Button::create('NO')->value('NO'),
            ]);

        return $this->ask($question, function (Answer $answer) {
            if ($answer->isInteractiveMessageReply()) {
                if ($answer->getValue() === 'YES') {
                    $this->say('Completed :)');
                } else {
                    $this->say('Thank you ');
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
        $this->askLeadConfirmed();
    }
}
