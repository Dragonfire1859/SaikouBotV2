// -- Requiring modules
const chalk = require('chalk');
const discord = require('discord.js');
const { Client, Collection, MessageEmbed } = discord;
const { config } = require('dotenv');
const mongoose = require('mongoose');
const noblox = require('noblox.js');

const bot = new Client({ ws: { intents: ['GUILD_PRESENCES', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'GUILDS', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS', 'DIRECT_MESSAGE_REACTIONS'] }, partials: ['MESSAGE', 'REACTION'] });

bot.noblox = noblox;

global.colours = require('./jsonFiles/colours.json');
global.discord = discord;
global.MessageEmbed = MessageEmbed;


// -- Setting .env path
config({
	path: __dirname + '/.env',
});

config({
	path: __dirname + '/.env.example',
});

try {
	process.env.owners = JSON.parse(process.env.OWNERS); // parsed owners from .env
}
catch (err) {
	process.env.owners = []; // placeholder
	console.log('Failed to load owners');
	console.error(err);
}

['aliases', 'commands'].forEach((x) => (bot[x] = new Collection()));
(async () => {
	const handlers = ['database', 'utils', 'command', 'event'];
	for (let i = 0; i < handlers.length; i++) {
		const handler = handlers[i];
		try {
			await (require(`./handlers/${handler}`))(bot);
		}
		catch(err) {
			console.error(err);
			console.error(`${chalk.bgYellow('Failed')} loading handler ${chalk.bold(handler)}`);
		}
	}

	if (!process.env.review) {
		mongoose.connect(process.env.MONGOPASSWORD, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});
		// ---Logging in with token or test token---
		const token = process.env.TEST == 'true' ? process.env.TESTTOKEN : process.env.TOKEN;
		bot.login(token);
		noblox.setCookie(process.env.COOKIE);
	}
	else {
		bot.destroy();
	}
})();
