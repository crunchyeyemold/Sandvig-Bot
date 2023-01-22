const { SlashCommandBuilder, PermissionFlagsBits, ChatInputCommandInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, Client, GatewayIntentBits, EmbedBuilder, MessageComponentInteraction } = require('discord.js');
const Database = require("@replit/database")
const db = new Database()
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startquiz')
        .setDescription('Starts a quiz!')
        .addNumberOption(option =>
            option
                .setName('chapter')
                .setDescription('Which chapter do you wish to study?')
                .setRequired(true)),
async execute(interaction) {
  let chapter = interaction.options.getNumber('chapter');
  let chapid = Number(chapter) * 10 + 1;
  let qvalue = await db.get(chapid);
  let qnum = qvalue.slice(0, 1);
  let question = qvalue.slice(1, 2);
  let a1 = qvalue.slice(2, 3);
  let a2 = qvalue.slice(3, 4);
  let a3 = qvalue.slice(4, 5);
  let a4 = qvalue.slice(5, 6);
  let correct = qvalue.slice(6, 7);
  let user = interaction.user.username;
  let userid = interaction.user.id;
  let userq = interaction.user.id + `1`;
  let rq = await db.get(userq);
  if (rq === 0) {
    await interaction.reply({ content: `Error: You have used all of your quiz credits! You must request a manual limit increase or upgrade to Gold to keep taking quizzes.` });
    return;
  }
  if (rq === null) { 
    await interaction.reply({ content: 'Hey there, welcome to Sandvig Bot! You can take up to 50 quizzes for free! Go ahead and run `/startquiz` again to start your first quiz!' });
    db.set(userq, 50).then(() => {});
    return;
  }
  let ssid = process.env.ssid;
  let chapterc = process.env.chapterc;
  let chapterrole = process.env.chapterrole;
  let member = interaction.member;
  if (Number(chapter) === Number(chapterc) && Number(ssid) === Number(interaction.guild.id)) {
     interaction.member.roles.add(chapterrole);
  }
  let uquizzes = await db.get(userq);
  let newquiz = Number(uquizzes) - 1;
  db.set(userq, newquiz).then(() => {});
  db.set(userid, 1).then(() => {});
  const embed = new EmbedBuilder()
    .setTitle(`Question ${qnum}`)
    .setDescription(`${question}
A - ${a1}
B - ${a2}
C - ${a3}
D - ${a4}`);
  const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('A')
                    .setLabel('A')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('B')
                    .setLabel('B')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('C')
                    .setLabel('C')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('D')
                    .setLabel('D')
                    .setStyle(ButtonStyle.Primary),
            );
  const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('answera')
                    .setLabel('A')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('answerb')
                    .setLabel('B')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('answerc')
                    .setLabel('C')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('answerd')
                    .setLabel('D')
                    .setDisabled(true)
                    .setStyle(ButtonStyle.Primary),
            );

        await interaction.reply({ content: ``, components: [row], embeds: [embed] });
  
  const filter = i => i.customId === 'A' || 'B' || 'C' || 'D';

const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });
  
collector.on('collect', async i => {
    let currentq = await db.get(userid);
    let currentp = Number(currentq) + 1;
  if (Number(currentp) < 11) {
    db.set(userid, currentp).then(() => {});
  }
    chapid = Number(chapter) * 10 + Number(currentq);
    let chapid2 = Number(chapter) * 10 + Number(currentp);
    qvalue = await db.get(chapid);
  if (Number(currentp) < 11) {
    let qvalue2 = await db.get(chapid2);
    qnum = qvalue2.slice(0, 1);
    question = qvalue2.slice(1, 2);
    a1 = qvalue2.slice(2, 3);
    a2 = qvalue2.slice(3, 4);
    a3 = qvalue2.slice(4, 5);
    a4 = qvalue2.slice(5, 6);
  }
    correct = qvalue.slice(6, 7);
    let question2 = qvalue.slice(1, 2);
    let a12 = qvalue.slice(2, 3);
    let a22 = qvalue.slice(3, 4);
    let a32 = qvalue.slice(4, 5);
    let a42 = qvalue.slice(5, 6);
  if (Number(currentp) < 11) {
  let embed2 = new EmbedBuilder()
    .setTitle(`Question ${qnum}`)
    .setDescription(`${question}
A - ${a1}
B - ${a2}
C - ${a3}
D - ${a4}`);
    if (String(i.customId) === String(correct[0])) {
    await i.update({ content: `Correct! You chose option **${i.customId}**.
**Original Question:** ${question2}
**A** - ${a12}
**B** - ${a22}
**C** - ${a32}
**D** - ${a42}`, components: [row], embeds: [embed2] });
    }
    else {
    await i.update({ content: `Wrong! You chose option **${i.customId}**, the correct answer was **${correct}**.
**Original Question:** ${question2}
**A** - ${a12}
**B** - ${a22}
**C** - ${a32}
**D** - ${a42}`, components: [row], embeds: [embed2] });
    }
  }
  else {
    let embed3 = new EmbedBuilder()
    .setTitle(`Quiz Completed!`)
    .setDescription(`Use /startquiz to try another! You have ${newquiz} quiz credits remaining.`);
    if (String(i.customId) === String(correct[0])) {
    await i.update({ content: `Correct! You chose option **${i.customId}**.
**Original Question:** ${question2}
**A** - ${a12}
**B** - ${a22}
**C** - ${a32}
**D** - ${a42}`, components: [row2], embeds: [embed3] });
    }
    else {
    await i.update({ content: `Wrong! You chose option **${i.customId}**.
**Original Question:** ${question2}
**A** - ${a12}
**B** - ${a22}
**C** - ${a32}
**D** - ${a42}`, components: [row2], embeds: [embed3] });
    }
  }
});

collector.on('end', collected => console.log(`Collected ${collected.size} items`));
    },
  
};