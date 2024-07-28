module.exports = {
    name: 'daily',
    description: 'Get your daily cash. 💰',
    aliases: [],
    async execute(message, args, db) {
      const user = message.author.id;
      const lastDaily = db.get(`daily_${user}`);
  
      if (lastDaily && (Date.now() - lastDaily) < 86400000) {
        return message.reply('🕒 You have already collected your daily cash. Please try again later.');
      }
  
      const amount = Math.floor(Math.random() * 100) + 50;
      db.set(`daily_${user}`, Date.now());
      db.add(`cash_${user}`, amount);
  
      message.reply(`🎉 You have received ${amount} cash!`);
    }
  };
  