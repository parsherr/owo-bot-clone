module.exports = {
    name: 'blackjack',
    description: 'Play blackjack. 🃏',
    aliases: ['bj'],
    cooldown: 5,
    async execute(message, args, db) {
      const user = message.author.id;
      const bet = parseInt(args[0]);
  
      if (isNaN(bet) || bet <= 0) {
        return message.reply('❌ Please specify a valid bet amount.');
      }
  
      let cash = db.get(`cash_${user}`) || 0;
  
      if (cash < bet) {
        return message.reply('❌ You do not have enough cash.');
      }
  
      const dealerHand = Math.floor(Math.random() * 21) + 1;
      const playerHand = Math.floor(Math.random() * 21) + 1;
  
      let resultMessage = `🃏 Dealer's hand: ${dealerHand}\n🃏 Your hand: ${playerHand}\n`;
  
      if (playerHand > dealerHand) {
        db.add(`cash_${user}`, bet);
        resultMessage += `🎉 You won ${bet} cash!`;
      } else if (playerHand < dealerHand) {
        db.add(`cash_${user}`, -bet);
        resultMessage += `❌ You lost ${bet} cash.`;
      } else {
        resultMessage += `🔄 It's a tie.`;
      }
  
      message.reply(resultMessage);
    }
  };
  