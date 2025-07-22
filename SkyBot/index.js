require('dotenv').config();
const { Client, GatewayIntentBits, Collection, Events } = require('discord.js');
const fs = require('fs');
const path = require('path');

const prefix = '!';
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Chargement des interactions (comme bouton ticket)
const interactionHandler = require('./events/interactionCreate');
client.on(Events.InteractionCreate, interaction => {
  interactionHandler.execute(interaction);
});

// Gestion du messageCreate pour les commandes préfixées
client.on('messageCreate', async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (commandName === 'ticketpanel') {
    const ticketPanelCommand = require('./commands_prefix/ticket');
    await ticketPanelCommand.execute(message, args);
  }

  // Autres commandes texte ici...
});

// Quand le bot est prêt
client.once('ready', () => {
  console.log(`✅ Connecté en tant que ${client.user.tag}`);
});

// Connexion à Discord
client.login(process.env.TOKEN);
