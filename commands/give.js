module.exports = {
    name: 'give',
    description: 'Give cash to another user. 💸',
    aliases: [],
    async execute(message, args, db) {
      const user = message.author.id;
      const target = message.mentions.users.first();
      const amount = parseInt(args[1]);
  
      if (!target || isNaN(amount) || amount <= 0) {
        return message.reply('❌ Please mention a valid user and amount.');
      }
  
      let cash = db.get(`cash_${user}`) || 0;
  
      if (cash < amount) {
        return message.reply('❌ You do not have enough cash.');
      }
  
      db.add(`cash_${user}`, -amount);
      db.add(`cash_${target.id}`, amount);
  
      message.reply(`💸 You have given ${amount} cash to ${target.username}.`);
    }
  };
  