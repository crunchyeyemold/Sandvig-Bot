const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Client, GatewayIntentBits, EmbedBuilder, MessageComponentInteraction } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search the database for a value!')
        .addStringOption(option =>
            option
                .setName('key')
                .setDescription('Key to search for')
                .setRequired(true)),
async execute(interaction) {
  let owner = process.env.owner;
  if (interaction.user.id !== owner) {
  await interaction.reply({ content: `Error: You do not have permission to perform this command!`, components: [] });
  return;
  }
  let key = interaction.options.getString('key');
  let result = await db.get(key);
  await interaction.reply({ content: `${key} = ${result}`, components: [] });
},
};