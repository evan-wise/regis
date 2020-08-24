import {
    Client as DiscordClient,
    Message,
    Client
} from 'discord.js';
import { Sequelize } from 'sequelize';
import { processTrivia } from './trivia';
import { Auth } from './config/auth';
import { initModels } from './models';
import { once } from 'events';

// Use these to track user data for this proof of concept. :)
global.userStateMap = new Map();
global.userQuestionMap = new Map();
global.userNumCorrectMap = new Map();

async function nextMessage(client: Client): Promise<Message> {
    return once(client, 'message').then(([message]) => message);
}

async function* getMessages(client: Client) {
    while (true) {
        yield await nextMessage(client);
    }
}

async function handleMessages(client) {
    // Loop over all messages
    for await (const msg of getMessages(client) ) {
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
(async() => {
    console.log('starting up');

    const auth = await Auth.load();
    console.log('regis found the keys')

    const sequelize = new Sequelize(auth.postgres.connectionString);
    await sequelize.authenticate();
    console.log('authenticated database connection');
    initModels(sequelize); // Perform set up for model data types.
    await sequelize.sync({ force: true });
    console.log('synchronized database schema');

    const client = new DiscordClient();
    await client.login(auth.discord.botUserToken); // Login with the user.
    console.log('authenticated discord bot user');
    console.log('regis is listening...')

    await handleMessages(client);
})();