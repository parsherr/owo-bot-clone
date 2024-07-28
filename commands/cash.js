module.exports = {
    name: 'cash',
    description: 'Show your current cash. 💵',
    aliases: [],
    async execute(message, args, db) {
      const user = message.author.id;
      const cash = db.get(`cash_${user}`) || 0;
      message.reply(`💵 You have ${cash} cash.`);
    }
  };
  