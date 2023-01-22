const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletequestion')
        .setDescription('Delete a question from the database!')
  .addStringOption(option =>
            option
                .setName('key')
                .setDescription('Select key')
                .setRequired(true)),
async execute(interaction) {
  let owner = process.env.owner;
  if (interaction.user.id !== owner) {
  await interaction.reply({ content: `Error: You do not have permission to perform this command!`, components: [] });
  return;
  }
  let key = interaction.options.getString('key');
  db.delete(key).then(() => {});
        await interaction.reply({ content: `Deleted ${key} from the database!`, components: [] });
    },
  
};