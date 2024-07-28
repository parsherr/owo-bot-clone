const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  description: 'Show the top 25 users with the most cash. 🏆',
  aliases: ['lb'],
  async execute(message, args, db) {
    const allUsers = db.all().filter(entry => entry.ID.startsWith('cash_'));
    const sortedUsers = allUsers.sort((a, b) => b.data - a.data).slice(0, 25);

    const embed = new EmbedBuilder()
      .setTitle('🏆 Leaderboard')
      .setColor('#FFD700');

    sortedUsers.forEach((user, index) => {
      const userId = user.ID.split('_')[1];
      const username = message.client.users.cache.get(userId)?.username || 'Unknown User';
      embed.addFields({ 
        name: `${index + 1}. ${username}`, 
        value: `${user.data} cash` 
      });
    });

    message.reply({ embeds: [embed] });
  }
};
