import {
    Client as DiscordClient,
    Message,
} from 'discord.js';
import { Sequelize, Op } from 'sequelize';
import { processTrivia } from './trivia';
import { Auth } from './config/auth';
import { initModels, League, Game } from './models';
import { once } from 'events';

// Use these to track user data for this proof of concept. :)
global.userStateMap = new Map();
global.userQuestionMap = new Map();
global.userNumCorrectMap = new Map();

async function nextMessage(client: DiscordClient): Promise<Message> {
    return once(client, 'message').then(([message]) => message);
}

async function* getMessages(client: DiscordClient) {
    while (true) {
        yield await nextMessage(client);
    }
}

async function handleMessages(client: DiscordClient) {
    // Loop over all messages
    for await (const msg of getMessages(client)) {
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

// Just a proof of concept type implementation, this won't scale well with lots of servers.
async function setupLeagues(client: DiscordClient) {
    const leagues = await League.findAll();
    const guilds = Array.from(client.guilds.cache.values())
        .filter(g => !leagues.find(l => l.discordId == g.id));
    if (guilds.length > 0) {
        await Promise.all(guilds.map(g => g.fetch()))
        const data = guilds.map(g => ({ discordId: g.id, guildName: g.name }));
        return await League.bulkCreate(data);
    } else {
        return leagues;
    }
}

// Similar, proof of concept.
async function scheduleGameThisWeek(league: League) {
    const now = new Date();
    const sunday = new Date();
    const saturday = new Date();
    sunday.setDate(now.getDate() - now.getDay());
    saturday.setDate(now.getDate() + (6 - now.getDay()));

    const game = await Game.findOne({
        where: {
            LeagueId: league.id,
            scheduledStart: { [Op.between]: [sunday, saturday] }
        }
    });

    if (!game) {
        const scheduledStart = new Date();
        scheduledStart.setDate(now.getDate() + league.weekDay - now.getDay());
        scheduledStart.setHours(19, 0, 0);
        await Game.create({ scheduledStart });
    }
}

// Main body, async so we can use await.
(async() => {
    console.log('starting up...');

    // Load config files.
    const auth = await Auth.load();
    console.log('regis found the keys...')

    // Create database connection.
    const sequelize = new Sequelize(auth.postgres.connectionString);
    await sequelize.authenticate();
    console.log('authenticated database connection!');

    // Perform setup for models and database tables.
    initModels(sequelize);
    await sequelize.sync({ force: true }); // Just for proof of concept, in production this will be done through migrations.
    console.log('synchronized database schema!');

    // Create discord client and log in.
    const client = new DiscordClient();
    await client.login(auth.discord.botUserToken);
    console.log('authenticated discord bot user');
    console.log('regis is listening...')

    // Create data for leagues and games.
    const leagues = await setupLeagues(client);
    console.log('set up leagues')
    for (const league of leagues) {
        await scheduleGameThisWeek(league);
    }

    // Handle incoming messages.
    await handleMessages(client);
})();