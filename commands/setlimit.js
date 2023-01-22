const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Client, GatewayIntentBits, EmbedBuilder, MessageComponentInteraction } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setlimit')
        .setDescription('Sets the quiz limit for a user!')
        .addStringOption(option =>
            option
                .setName('user')
                .setDescription('ID of the user to update')
                .setRequired(true))
  .addNumberOption(option =>
            option
                .setName('limit')
                .setDescription('The new limit')
                .setRequired(true)),
async execute(interaction) {
  let owner = process.env.owner;
  if (interaction.user.id !== owner) {
  await interaction.reply({ content: `Error: You do not have permission to perform this command!`, components: [] });
  return;
  }
  let user = interaction.options.getString('user');
  let limit = interaction.options.getNumber('limit');
  db.set(user + 1, limit).then(() => {});
  await interaction.reply({ content: `Set ${user}'s quiz credits to ${limit}!`, components: [] });
},
};