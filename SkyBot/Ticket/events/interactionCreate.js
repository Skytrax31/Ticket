const {
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  ChannelType,
  PermissionsBitField,
  ActionRowBuilder,
  Events
} = require('discord.js');

// Déclaration de la config des tickets
const ticketCategories = {
  Commanding: { categoryId: '1393927889027731516', allowedRoles: ['1387229129182543882'] },
  Supervisor: { categoryId: '1384526783046746255', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
  Formation: { categoryId: '1393932774892900372', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
  Recrutement: { categoryId: '1395683767032615013', allowedRoles: ['1387229129182543882', '1393899501919539253'] },
};

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      // === Gestion des boutons ===
      if (interaction.isButton()) {
        if (interaction.customId === 'create_ticket') {
          const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_type_select')
            .setPlaceholder('Sélectionnez le type de ticket')
            .addOptions(
              Object.entries(ticketCategories).map(([key]) => ({
                label: key.charAt(0).toUpperCase() + key.slice(1),
                value: key
              }))
            );

          const row = new ActionRowBuilder().addComponents(selectMenu);

          await interaction.reply({
            content: 'Quel type de ticket souhaitez-vous créer ?',
            components: [row],
            ephemeral: true
          });
        }

        else if (interaction.customId === 'close_ticket') {
          await interaction.reply({ content: 'Le ticket sera fermé dans 5 secondes...', ephemeral: true });
          setTimeout(() => {
            interaction.channel.delete().catch(console.error);
          }, 5000);
        }

        else if (interaction.customId === 'prendre_en_charge') {
          const message = interaction.message;

          // Trouver le bouton fermer dans les composants existants
          const closeButton = message.components[0].components.find(btn => btn.customId === 'close_ticket');

          // Créer un nouveau bouton "prendre_en_charge" désactivé et avec label modifié
          const newTakeButton = new ButtonBuilder()
            .setCustomId('prendre_en_charge')
            .setLabel(`🔓 Pris en charge par ${interaction.user.username}`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true);

          const buttonsRow = new ActionRowBuilder().addComponents(newTakeButton, closeButton);

          // Mettre à jour le message avec les boutons modifiés
          await interaction.update({
            content: message.content,
            components: [buttonsRow]
          });

          // Réponse éphémère pour l’utilisateur qui clique
          await interaction.followUp({
            content: `🔓 Vous avez pris en charge ce ticket.`,
            ephemeral: true
          });
        }
      }

      // === Gestion de la sélection du type de ticket ===
      if (interaction.isStringSelectMenu()) {
        if (interaction.customId === 'ticket_type_select') {
          const selectedType = interaction.values[0];
          const config = ticketCategories[selectedType];

          if (!config) {
            return interaction.update({ content: 'Type de ticket invalide.', components: [] });
          }

          const { categoryId, allowedRoles } = config;

          const permissionOverwrites = [
            {
              id: interaction.guild.id,
              deny: [PermissionsBitField.Flags.ViewChannel]
            },
            {
              id: interaction.user.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.AttachFiles
              ]
            },
            ...allowedRoles.map(roleId => ({
              id: roleId,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory,
                PermissionsBitField.Flags.AttachFiles
              ]
            }))
          ];

          const ticketChannel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: categoryId,
            permissionOverwrites
          });

          const closeButton = new ButtonBuilder()
            .setCustomId('close_ticket')
            .setLabel('🔒 Fermer Le Ticket')
            .setStyle(ButtonStyle.Danger);

          const takeButton = new ButtonBuilder()
            .setCustomId('prendre_en_charge')
            .setLabel('🔓 Prendre En Charge')
            .setStyle(ButtonStyle.Success);

          const buttonsRow = new ActionRowBuilder().addComponents(takeButton, closeButton);

          await ticketChannel.send({
            content: `Bonjour ${interaction.user}, merci d'exposer votre requête, un superviseur vous répondra sous peu.`,
            components: [buttonsRow]
          });

          await interaction.update({
            content: `✅ Votre ticket a été créé : ${ticketChannel}`,
            components: []
          });
        }
      }
    } catch (error) {
      console.error('❌ Erreur dans interactionCreate.js :', error);
      if (interaction.deferred || interaction.replied) {
        await interaction.followUp({ content: 'Une erreur est survenue.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true });
      }
    }
  }
};