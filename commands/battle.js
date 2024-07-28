const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'battle',
  description: 'Battle with a random opponent. ⚔️',
  aliases: [],
  async execute(message, args, db) {
    const user = message.author.id;
    const cash = db.get(`cash_${user}`) || 0;
    const bet = parseInt(args[0]);

    if (isNaN(bet) || bet <= 0) {
      return message.reply('❌ Please specify a valid bet amount.');
    }

    if (cash < bet) {
      return message.reply('❌ You do not have enough cash.');
    }

    const result = Math.random() < 0.5 ? 'win' : 'lose';
    let resultMessage;

    if (result === 'win') {
      db.add(`cash_${user}`, bet);
      resultMessage = `🎉 You won the battle and earned ${bet} cash!`;
    } else {
      db.add(`cash_${user}`, -bet);
      resultMessage = `❌ You lost the battle and lost ${bet} cash.`;
    }

    const embed = new EmbedBuilder()
      .setTitle('⚔️ Battle Result')
      .setDescription(resultMessage)
      .setColor(result === 'win' ? '#00FF00' : '#FF0000');

    message.reply({ embeds: [embed] });
  }
};
