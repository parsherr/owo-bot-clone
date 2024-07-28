module.exports = {
    name: 'sell',
    description: 'Sell your hunted animals. 💵',
    aliases: [],
    async execute(message, args, db) {
      const user = message.author.id;
      const animal = args[0];
  
      const animalPrices = {
        'rabbit': 10,
        'deer': 20,
        'fox': 30,
        'bear': 40,
        'wolf': 50
      };
  
      const emojis = {
        'rabbit': '🐇',
        'deer': '🦌',
        'fox': '🦊',
        'bear': '🐻',
        'wolf': '🐺'
      };
  
      if (animal === 'all') {
        let totalCash = 0;
        let soldAnimals = '';
  
        for (const [key, price] of Object.entries(animalPrices)) {
          const count = db.get(`animal_${user}_${key}`) || 0;
          if (count > 0) {
            totalCash += count * price;
            soldAnimals += `${emojis[key]} ${key}: ${count}\n`;
            db.set(`animal_${user}_${key}`, 0);  // Hayvan sayısını sıfırlıyoruz
          }
        }
  
        if (totalCash === 0) {
          return message.reply('❌ You have no animals to sell.');
        }
  
        db.add(`cash_${user}`, totalCash);
  
        const replyMessage = `💵 You sold all your animals and received ${totalCash} cash:\n${soldAnimals}`;
        return message.reply(replyMessage);
      } else {
        if (!animal) {
          return message.reply('❌ Please specify an animal to sell or use "sell all" to sell all animals.');
        }
  
        const animalCount = db.get(`animal_${user}_${animal}`) || 0;
        const price = animalPrices[animal];
  
        if (!price) {
          return message.reply('❌ Invalid animal specified.');
        }
  
        if (animalCount < 1) {
          return message.reply(`❌ You don't have any ${animal} to sell.`);
        }
  
        db.add(`animal_${user}_${animal}`, -1);
        db.add(`cash_${user}`, price);
  
        message.reply(`💵 You sold a ${emojis[animal]} ${animal} for ${price} cash.`);
      }
    }
  };
  