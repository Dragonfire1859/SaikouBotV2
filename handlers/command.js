const Cooldown = require('../utils/cooldown');

const {
	readdirSync
} = require('fs');

module.exports = (bot) => {
	const load = dirs => {
		const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
		for (const file of commands) {
			const pull = require(`../commands/${dirs}/${file}`);
			if (pull.config.cooldown) {
				pull.cooldown = new Cooldown({
					name: pull.config.name,
					cooldown: pull.config.cooldown === true ? undefined : pull.config.cooldown,
					roles: pull.config.cooldownRoles
				});
			}
			bot.commands.set(pull.config.name, pull);
			if (pull.config.aliases) pull.config.aliases.forEach(a => bot.aliases.set(a, pull.config.name));
		}
	};
	['miscellaneous', 'moderation', 'owner', 'economy'].forEach(x => load(x));
};