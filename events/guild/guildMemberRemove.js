module.exports = (client, member) => {
  const { MessageEmbed } = require('discord.js');
  const Colour = require('../../jsonFiles/colours.json')

  let WelcomeChannel = member.guild.channels.cache.get('635196002596290611');

  // -- Ban user embed
  member.guild.fetchBan(member).then((ban) => {

    const userBannedEmbed = new MessageEmbed()
      .setColor("#f94343")
      .setTitle("Member Banned")
      .setDescription(`**${member.user.tag}** has been banned from Saikou by a member of staff!`)
      .setImage('https://media.giphy.com/media/H99r2HtnYs492/giphy.gif')
      .setFooter(`User banned`)
      .setTimestamp();

    WelcomeChannel.send(userBannedEmbed)
  }).catch(() => {

    const RoleMessages = [
      'has abandoned Saikou. Goodbye!', // Follower
      "has left Saikou. We'll miss you!", // Dedicated Follower
      'has said their farewells and left Saikou. We appreciated your support towards us!', // Ultimate Follower
      "has abandoned Saikou. Thank you for dedication and support, this server wouldn't be what it is without you. ", // Supreme Follower
      'has abandoned Saikou. After such a long time, you deserve a bit of rest. You will always be remembered as the legend you are. ', // Legendary Follower
      'has abandoned Saikou. Thank you for sticking with us this long. We appreciate it ❤ ', // Omega Follower
      'has abandoned Saikou. Wait... you were a staff member here!' // Staff
    ];


    if (member.roles.cache.some(r => r.name === "Follower")) { var msg = new String(); msg += `${RoleMessages[0]}`; }
    else if (member.roles.cache.some(r => r.name === "Dedicated Follower")) { var msg = new String(); msg += `${RoleMessages[1]}`; }
    else if (member.roles.cache.some(r => r.name === "Ultimate Follower")) { var msg = new String(); msg += `${RoleMessages[2]}`; }
    else if (member.roles.cache.some(r => r.name === "Supreme Follower")) { var msg = new String(); msg += `${RoleMessages[3]}`; }
    else if (member.roles.cache.some(r => r.name === "Legendary Follower")) { var msg = new String(); msg += `${RoleMessages[4]}`; }
    else if (member.roles.cache.some(r => r.name === "Omega Follower")) { var msg = new String(); msg += `${RoleMessages[5]}`; }
    else if (member.roles.cache.some(r => r.name === "Staff")) { var msg = new String(); msg += `${RoleMessages[6]}`; }
    else { var msg = new String(); msg += `${RoleMessages[0]}`; }


    // -- User leave embed  
    const RemoveEmbed = new MessageEmbed()
      .setTitle("Member left Saikou!")
      .setDescription(`**${member.user.tag}** ${msg}`)
      .setColor(Colour.red)
      .setFooter(`User left`)
      .setTimestamp();

    WelcomeChannel.send(RemoveEmbed);

    var logleaveembed = new MessageEmbed()
      .setColor(Colour.blue)
      .setTitle(':information_source: User left')
      .setDescription(`**${member.user.tag}** has left.`);

    member.guild.channels.cache.get('409832539360854019').send(logleaveembed)

  });
}
