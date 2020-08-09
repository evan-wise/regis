import { Message } from "discord.js";
import { Question } from './types/question';

// Handle printing different question types.
const handleQuestion = (question: Question, msg: Message) => {
    switch (question.type) {
        case 'multiple-choice':
            const letters = question.options.map((_, i) => String.fromCharCode(97 + i));
            const displayOptions = question.options.map((o, i) => `(${letters[i]}) ${o}`);
            msg.reply(`(Multiple Choice) ${question.text}\n${displayOptions.join(', ')}`);
            break;
        case 'true-false':
            msg.reply(`(True or False) ${question.text}`);
            break;
        case 'short-answer':
            msg.reply(`(Short Answer) ${question.text}`);
            break;
    }
};

// Handle checking answers for different question types.
const handleAnswer = (question: Question, tokens: string[]) => {
    switch (question.type) {
        case 'multiple-choice':
            const answer = question.options[question.answer].toLowerCase();
            const answerLetter = String.fromCharCode(97 + question.answer);
            return tokens.indexOf(answer) > 0 || tokens.indexOf(answerLetter) > 0;
        case 'true-false':
            return tokens.indexOf(question.answer.toString()) > 0;
        case 'short-answer':
            return tokens.indexOf(question.answer.toLowerCase()) > 0;
    }
};

// Just some sample questions.
const questions: Question[] = [{
    type: 'multiple-choice',
    text: 'How ornery is a flapjack on Saturday?',
    options: ['Not at all', 'A little', 'Some', 'A lot'],
    answer: 1
},
{
    type: 'true-false',
    text: 'Do I like turtles?',
    answer: true
},
{
    text: 'What is the name of the oldest living individual tree in the world?',
    type: 'short-answer',
    answer: 'Methuselah'
}
];

export const processTrivia = async (msg: Message, tokens: string[]) => {
    const state = global.userStateMap.get(msg.author.id);
    let questionNum = global.userQuestionMap.has(msg.author.id) ? global.userQuestionMap.get(msg.author.id) : 0;
    const question = questions[questionNum];
    if (!global.userStateMap.has(msg.author.id) || state === 'BEFORE_QUIZ') {
        if (tokens.indexOf('start') > 0) {
            msg.reply('Okay bud, starting up trivia...');
            global.userStateMap.set(msg.author.id, 'INSIDE_QUIZ');
            global.userQuestionMap.set(msg.author.id, 0);
            handleQuestion(question, msg);
        } else {
            msg.reply('Not sure what you mean there, chief.');
        }
    } else if (state === 'INSIDE_QUIZ') {
        if (handleAnswer(question, tokens)) {
            if (global.userNumCorrectMap.has(msg.author.id)) {
                global.userNumCorrectMap.set(msg.author.id, global.userNumCorrectMap.get(msg.author.id) + 1);
            } else {
                global.userNumCorrectMap.set(msg.author.id, 1);
            }
            msg.reply('Wait... that\'s right!');
        } else {
            msg.reply('git gud');
        }

        questionNum++;

        if (questionNum === questions.length) {
            msg.reply(`You got ${global.userNumCorrectMap.get(msg.author.id)} out of ${questions.length} correct.`);
            global.userNumCorrectMap.set(msg.author.id, 0);
            global.userStateMap.set(msg.author.id, 'BEFORE_QUIZ');
            global.userQuestionMap.set(msg.author.id, 0);
        } else {
            global.userQuestionMap.set(msg.author.id, questionNum);
            msg.reply('Next question...');
            handleQuestion(questions[questionNum], msg);
        }
    }
}