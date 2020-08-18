import { promises as fs } from 'fs';
import {
    Client as DiscordClient,
    Message 
} from 'discord.js';
import { processTrivia } from './trivia';
import { AuthLoader } from './config/auth.loader';

// Use these to track user data for this proof of concept. :)
global.userStateMap = new Map();
global.userQuestionMap = new Map();
global.userNumCorrectMap = new Map();

async function nextMessage(client) {
    return new Promise<Message>((resolve, reject) => {
        client.once('message', msg => resolve(msg));
        client.once('error', err => reject(err));
    });
}

async function* messages(client) {
    yield await nextMessage(client);
}

async function handleMessages(client) {
    // Loop over all messages
    for await (const msg of messages(client) ) {
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
        await processTrivia(msg, tokens);
    }
}

// Main body, async so we can use await.
const main = async() => {
    console.log('starting up');
    // Create client object.
    const client = new DiscordClient();
    // Load authentication related config.
    const auth = await AuthLoader.load();
    console.log('regis found the keys')
    // Login with the user.
    const value = await client.login(auth.discord.botUserToken);
    console.log('authenticated discord bot user');
    console.log('regis is listening...')
    await handleMessages(client);
};

main().then(() => console.log('regis lives'), (err) => console.error(err));