import { promises as fs } from 'fs';
import {
    Client as DiscordClient,
    Message 
} from 'discord.js';
import { processTrivia } from 'trivia';

// Use these to track user data for this proof of concept. :)
global.userStateMap = new Map();
global.userQuestionMap = new Map();
global.userNumCorrectMap = new Map();

// Main body, async so we can use await.
const main = async() => {
    console.log('starting up');
    // Create client object.
    const client = new DiscordClient();

    // Attach event listeners
    client.on('message', async (msg: Message) => {
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
        
    });

    // Read token from file, DON'T CHECK IT IN!
    const authRaw = await fs.readFile('auth.json', 'utf-8');
    const auth = JSON.parse(authRaw);
    await client.login(auth.botUserToken);
    console.log('authenticated');
};

main().then(() => console.log('regis lives'), (err) => console.log(err));