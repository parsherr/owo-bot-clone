module.exports = {
    name: 'autohunt',
    description: 'Automatically hunt for a specified number of animals. 🦊',
    aliases: ['ah', 'hb'],
    async execute(message, args, db) {
      const user = message.author.id;
      const cash = db.get(`cash_${user}`) || 0;
      const amount = parseInt(args[0]);
  
      if (isNaN(amount) || amount <= 0) {
        return message.reply('❌ Please specify a valid amount.');
      }
  
      const totalCost = amount * 10;
  
      if (cash < totalCost) {
        return message.reply(`❌ You need ${totalCost} cash to hunt ${amount} animals.`);
      }
  
      db.add(`cash_${user}`, -totalCost);
      message.reply(`🔄 Autohunt started for ${amount} animals. This will take ${amount * 5} minutes.`);
  
      for (let i = 1; i <= amount; i++) {
        setTimeout(() => {
          const animals = ['rabbit', 'deer', 'fox', 'bear', 'wolf'];
          const emojis = {
            'rabbit': '🐇',
            'deer': '🦌',
            'fox': '🦊',
            'bear': '🐻',
            'wolf': '🐺'
          };
          const huntedAnimal = animals[Math.floor(Math.random() * animals.length)];
          db.add(`animal_${user}_${huntedAnimal}`, 1);
          db.push(`zoo_${user}`, huntedAnimal);
          message.reply(`🎯 You have hunted a ${emojis[huntedAnimal]} ${huntedAnimal}!`);
        }, i * 300000); // 5 dakika (300000 ms)
      }
    }
  };
  