module.exports = {
    name: 'coinflip',
    description: 'Play coin flip. 🪙',
    aliases: ['cf'],
    cooldown: 5,
    async execute(message, args, db) {
      const user = message.author.id;
      const amount = parseInt(args[0]);
  
      if (isNaN(amount) || amount <= 0) {
        return message.reply('❌ Please specify a valid amount.');
      }
  
      let cash = db.get(`cash_${user}`) || 0;
  
      if (cash < amount) {
        return message.reply('❌ You do not have enough cash.');
      }
  
      const result = Math.random() < 0.5 ? 'heads' : 'tails';
      const choice = args[1].toLowerCase();
  
      if (choice !== 'heads' && choice !== 'tails') {
        return message.reply('❌ Please choose heads or tails.');
      }
  
      if (choice === result) {
        const winAmount = amount * 2;
        db.add(`cash_${user}`, winAmount);
        message.reply(`🎉 You won! The coin landed on ${result}. You received ${winAmount} cash.`);
      } else {
        db.add(`cash_${user}`, -amount);
        message.reply(`❌ You lost! The coin landed on ${result}. You lost ${amount} cash.`);
      }
    }
  };
  