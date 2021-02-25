const { Command, Argument, Category } = require('discord-akairo');
const CategoryType = require('../../types/category');
const SaikouEmbed = require('../../structure/SaikouEmbed');
const { CATEGORY_DISPLAY_NAMES } = require('../../util/Constants');

class Help extends Command {
	constructor() {
		super('help', {
			aliases: ['help'],
			description: {
				content: 'Gain a list of all saikou\'s commands!',
				usage: '[resource]'
			},
			args: [{
				id: 'resource',
				type: Argument.union('category', 'commandAlias'),
				match: 'rest'
			}]
		})
	}
	async exec(message, args) {
		let dm;
		if (message.channel.type === 'DM') dm = message.channel
		else dm = await message.author.createDM();

		const prefix = await this.handler.prefix

		if (!args.resource) {

			const helpEmbed = new SaikouEmbed()
				.setTitle(`📖 Saikou Commands`)
				.setDescription(`The prefix for Saikou is \`${prefix}\`
Currently featuring ${this.handler.modules.size} commands!`)
				.setFooter('Reply back with an option in DM\'s.');

			this.handler.categories.each(category => {
				helpEmbed.addField(CATEGORY_DISPLAY_NAMES[category.id] || category.id, `\`${prefix}help ${category.id}\``, true);
			});

			dm.send(helpEmbed);

			if (message.channel.type !== 'dm') {
			message.channel.send(new SaikouEmbed()
				.setDescription(`📬 A message has been sent to your DM's <@${message.author.id}>`)
				.setColor('GREEN'));
			}
		}
		else {
			if (args.resource instanceof Category) {
				const category = args.resource;

				const categoryEmbed = new SaikouEmbed()
					.setTitle(`${CATEGORY_DISPLAY_NAMES[category.id] || category.id} Commands`)
					.setDescription(`Saikou currently features ${category.size} ${category.id} commands!\n\n**${category.map(m => `${prefix}${m.aliases[0]}`).join(', ')}**`);

				dm.send(categoryEmbed);
			}
			else if (args.resource instanceof Command) {
				const command = args.resource;

				const aliases = command.aliases.concat();
				const name = aliases.shift();

				const commandEmbed = new SaikouEmbed()
					.setTitle(`${prefix}${name} Information`)
					.addField('Command Description:', `${command.description ? command.description.content : undefined || 'No Description.'}`)
					.addField('Usage:', `${prefix}${name}${command.description && command.description.usage ? ' ' + command.description.usage : ''}`)
					.addField('Aliases:', `${aliases.length ? aliases.join(', ') : 'N/A'}`);
					// .addField('Accessible to:', `${commandConfig.accessableby || 'N/A'}`)

				dm.send(commandEmbed);
			}
		}
	}
}
module.exports = Help;