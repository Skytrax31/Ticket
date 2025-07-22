const prefix = '!';

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (commandName === 'ticketpanel') {
      // Importe ta commande texte
      const ticketPanelCommand = require('./commands_prefix/ticketpanel'); // ou './commands_prefix/ticket' selon ton arborescence

      await ticketPanelCommand.execute(message, args);
    }

    // Gère d'autres commandes texte ici si besoin
  }
};