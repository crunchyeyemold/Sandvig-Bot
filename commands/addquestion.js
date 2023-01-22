const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addquestion')
        .setDescription('Add a question to the database!')
        .addNumberOption(option =>
            option
                .setName('chapter')
                .setDescription('Which chapter is this question for?')
                .setRequired(true))
      .addNumberOption(option =>
      option
                .setName('qnum')
                .setDescription('What question number is this?')
                .setRequired(true))
  .addStringOption(option =>
            option
                .setName('question')
                .setDescription('What is the question?')
                .setRequired(true))
      .addStringOption(option =>
            option
                .setName('a1')
                .setDescription('Answer 1')
                .setRequired(true))
      .addStringOption(option =>
            option
                .setName('a2')
                .setDescription('Answer 2')
                .setRequired(true))
      .addStringOption(option =>
            option
                .setName('a3')
                .setDescription('Answer 3')
                .setRequired(true))
      .addStringOption(option =>
            option
                .setName('a4')
                .setDescription('Answer 4')
                .setRequired(true))
  .addStringOption(option =>
            option
                .setName('correct')
                .setDescription('Which answer is correct?')
                .setRequired(true)),
async execute(interaction) {
  let owner = process.env.owner;
  if (interaction.user.id !== owner) {
  await interaction.reply({ content: `Error: You do not have permission to perform this command!`, components: [] });
  return;
  }
  let chapter = interaction.options.getNumber('chapter');
  let qnum = interaction.options.getNumber('qnum');
  let question = interaction.options.getString('question');
  let a1 = interaction.options.getString('a1');
  let a2 = interaction.options.getString('a2');
  let a3 = interaction.options.getString('a3');
  let a4 = interaction.options.getString('a4');
  let correct = interaction.options.getString('correct');
  let qid = Number(chapter) * 10 + Number(qnum);
  let qvalue = [`${qnum}`, `${question}`, `${a1}`, `${a2}`, `${a3}`, `${a4}`, `${correct}`];
  db.set(qid, qvalue).then(() => {});
  console.log(qvalue);
  let int = await db.get(`${qid}`);
        await interaction.reply({ content: `Question added.
Chapter ${chapter}
Question ID: ${qnum}
"${question}"
A - ${a1}
B - ${a2}
C - ${a3}
D - ${a4}
Correct Answer - ${correct}`, components: [] });
    },
  
};