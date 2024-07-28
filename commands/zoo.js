module.exports = {
    name: 'zoo',
    description: 'Show your hunted animals. 🦁',
    aliases: ['z'],
    async execute(message, args, db) {
      const user = message.author.id;
      const zoo = db.get(`zoo_${user}`) || [];
      const animalCount = zoo.reduce((acc, animal) => {
        acc[animal] = (acc[animal] || 0) + 1;
        return acc;
      }, {});
  
      const emojis = {
        'rabbit': '🐇',
        'deer': '🦌',
        'fox': '🦊',
        'bear': '🐻',
        'wolf': '🐺'
      };
  
      let reply = '🦊 Your zoo:\n';
      for (const animal in animalCount) {
        reply += `${emojis[animal]} ${animal}: ${animalCount[animal]}\n`;
      }
  
      message.reply(reply || 'You have no animals in your zoo.');
    }
  };
  