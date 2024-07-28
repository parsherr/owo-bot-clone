module.exports = {
    name: 'slot',
    description: 'Play slot machine. 🎰',
    aliases: [],
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
  
      const emojis = ['🍒', '🍋', '🍉'];
      const result = [emojis[Math.floor(Math.random() * emojis.length)], emojis[Math.floor(Math.random() * emojis.length)], emojis[Math.floor(Math.random() * emojis.length)]];
      
      if (result[0] === result[1] && result[1] === result[2]) {
        const winAmount = amount * 2;
        db.add(`cash_${user}`, winAmount);
        message.reply(`🎉 You won! ${result.join(' ')} You received ${winAmount} cash.`);
      } else {
        db.add(`cash_${user}`, -amount);
        message.reply(`❌ You lost! ${result.join(' ')} You lost ${amount} cash.`);
      }
    }
  };
  