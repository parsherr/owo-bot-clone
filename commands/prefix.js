module.exports = {
    name: 'prefix',
    description: 'Change the bot prefix. ✏️',
    aliases: [],
    async execute(message, args, db, client) {
      if (!args[0]) {
        return message.reply('❌ Please provide a new prefix.');
      }
  
      client.prefix = args[0];
      db.set('prefix', args[0]);
  
      message.reply(`✅ Prefix changed to ${args[0]}`);
    }
  };
  