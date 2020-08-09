const fs = require('fs').promises;
const Discord = require('discord.js');

// States for bootleg state machine below.
const states = [
    'BEFORE_QUIZ',
    'INSIDE_QUIZ'
];

// Just some sample questions.
const questions = [{
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

// Use these to track user data for this proof of concept. :)
let userStateMap = new Map();
let userQuestionMap = new Map();
let userNumCorrectMap = new Map();

// Handle printing different question types.
const handleQuestion = (question, msg) => {
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
const handleAnswer = (question, tokens) => {
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

// Main body, async so we can use await.
const main = async() => {
    console.log('starting up');
    // Create client object.
    const client = new Discord.Client();

    // Attach event listener (TODO: figure out how to turn this into async generator)
    client.on('message', msg => {
        // While we are testing, let's just ignore channels other than the bot playground and DMs.
        if (
            msg.channel.hasOwnProperty('name') && 
            (msg.channel as any).name !== 'bot-playground' &&
            msg.channel.type !== 'dm'
        ) {
            return;
        }

        // We only want to look at messages that mention the bot.
        if (!msg.mentions.users.has(client.user.id)) {
            return;
        }

        // Parse the message input.
        const tokens = msg.content.toLowerCase().split(/\s+/).filter(t => t !== `@${client.user.username}`);

        // Set up bootleg state machine and process input.
        const state = userStateMap.get(msg.author.id);
        let questionNum = userQuestionMap.has(msg.author.id) ? userQuestionMap.get(msg.author.id) : 0;
        const question = questions[questionNum];
        if (!userStateMap.has(msg.author.id) || state === 'BEFORE_QUIZ') {
            if (tokens.indexOf('start') > 0) {
                msg.reply('Okay bud, starting up trivia...');
                userStateMap.set(msg.author.id, 'INSIDE_QUIZ');
                userQuestionMap.set(msg.author.id, 0);
                handleQuestion(question, msg);
            } else {
                msg.reply('Not sure what you mean there, chief.');
            }
        } else if (state === 'INSIDE_QUIZ') {
            if (handleAnswer(question, tokens)) {
                if (userNumCorrectMap.has(msg.author.id)) {
                    userNumCorrectMap.set(msg.author.id, userNumCorrectMap.get(msg.author.id) + 1);
                } else {
                    userNumCorrectMap.set(msg.author.id, 1);
                }
                msg.reply('Wait... that\'s right!');
            } else {
                msg.reply('git gud');
            }

            questionNum++;

            if (questionNum === questions.length) {
                msg.reply(`You got ${userNumCorrectMap.get(msg.author.id)} out of ${questions.length} correct.`);
                userNumCorrectMap.set(msg.author.id, 0);
                userStateMap.set(msg.author.id, 'BEFORE_QUIZ');
                userQuestionMap.set(msg.author.id, 0);
            } else {
                userQuestionMap.set(msg.author.id, questionNum);
                msg.reply('Next question...');
                handleQuestion(questions[questionNum], msg);
            }
        }

    });

    // Read token from file, DON'T CHECK IT IN!
    const authRaw = await fs.readFile('auth.json', 'utf-8');
    const auth = JSON.parse(authRaw);
    await client.login(auth.botUserToken);
    console.log('authenticated');
};

main().then(() => console.log('regis lives'), (err) => console.log(err));