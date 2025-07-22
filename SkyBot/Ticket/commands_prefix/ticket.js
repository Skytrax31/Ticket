 const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, ChannelType, PermissionsBitField } = require('discord.js');

const ticketCategories = {
  // même objet que toi
  Commanding: { categoryId: '1393927889027731516', allowedRoles: ['1387229129182543882'] },
  Supervisor: { categoryId: '1384526783046746255', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
  Formation: { categoryId: '1393932774892900372', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
  Recrutement: { categoryId: '1395683767032615013', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
};

    module.exports = {
      name: 'ticketpanel',
      description: 'Affiche le panneau de création de tickets',
      async execute(message, args) {
        const embed = new EmbedBuilder()
          .setTitle('🫆 HP Ticket Operator')
          .setDescription('Merci de créer un ticket selon vos besoins et d’utiliser les formules de politesse.')
          .setImage('https://drive.google.com/uc?export=download&id=1Bq6GTOulHCWSBI7bM7sZJaPbDl9Dd2aI')
          .addFields(
            { name: '🗃️ **Règlement**', value: '[Cliquez ici](https://discord.com/channels/1384515721593225216/1384516522814472245/1395472061056417874)', inline: true },
            { name: '📑 **Types**', value: '4 types disponibles', inline: true }
          )
          .setFooter({ text: 'HP Ticket Operator' })
          .setColor(0xE6A817);

        // Crée le bouton ici, et utilise la variable 'button'
        const button = new ButtonBuilder()
          .setCustomId('create_ticket')
          .setLabel('✉️ Créer un ticket')
          .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(button);

        await message.channel.send({ embeds: [embed], components: [row] });
  },

  ticketCategories, // exporte l'objet pour réutilisation ailleurs (optionnel)
};