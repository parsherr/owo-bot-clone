const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const db = require('croxydb');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.defaultPrefix = config.prefix;
client.prefix = db.get('prefix') || client.defaultPrefix;

// Komut dosyalarını yükleyin
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  if (command.aliases) {
    command.aliases.forEach(alias => client.commands.set(alias, command));
  }
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {
  if (message.author.bot) return;

  const prefixes = [client.prefix, client.defaultPrefix];
  const prefix = prefixes.find(p => message.content.startsWith(p));

  if (!prefix) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  const now = Date.now();
  const timestamps = client.cooldowns.get(command.name) || new Map();
  const cooldownAmount = (command.cooldown || 0) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      const reply = await message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      setTimeout(() => reply.delete(), timeLeft * 1000);
      return;
    }
  }

  timestamps.set(message.author.id, now);
  client.cooldowns.set(command.name, timestamps);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    await command.execute(message, args, db, client);
  } catch (error) {
    console.error(error);
    message.reply('❌ There was an error executing that command.');
  }
});

client.login(config.token);
