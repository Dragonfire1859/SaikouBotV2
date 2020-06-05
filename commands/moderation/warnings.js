const { MessageEmbed } = require('discord.js');

const errors = require('.././utils/errors');
const { getUserMod } = require('../utils/getUserMod');
const warnData = require('../../models/warnData');
const colours = require('../../jsonFiles/colours.json');

module.exports = {
    config: {
        name: 'warnings',
        description: 'Reserved for the staff team to warn a user',
        usage: '.warn/givewarn <user>',
        accessableby: 'Public',
        aliases: ['viewwarns', 'checkwarns'],
    },
    run: async (bot, message, args) => {

        const member = getUserMod(message, args[0]);
        let i = 0;

        if (!member) {
            return errors.noUser(message, 'view warns');
        }

        warnData.findOne({
            userID: member.id,
            guild: message.guild.id,
        }, (err, warnings) => {
            if (err) console.log(err);

            if (!warnings) {
                const NoWarns = new MessageEmbed()
                    .setDescription('ℹ️ This user has no warnings.')
                    .setColor(colours.blurple);

                return message.channel.send(NoWarns);
            }

            const warnEmbed = new MessageEmbed()
                .setAuthor(`${member.displayName} has ${warnings.warns.length} warnings in ${message.guild.name}`, member.user.displayAvatarURL())
                .setColor(colours.blurple);


            warnings.warns.forEach(a => {
                i++;
                warnEmbed.addField(`Warning: ${i} | Moderator: ${message.guild.members.cache.get(a.Moderator).user.tag}`, `${a.Reason} - ${a.Time}`);
            });

            message.channel.send(warnEmbed);


        });

    },
};