require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('event')
    .setDescription('Manage guild activity sign-up events')
    .addSubcommand((sub) =>
      sub
        .setName('create')
        .setDescription('Post a new sign-up event')
        .addStringOption((opt) =>
          opt
            .setName('type')
            .setDescription('Type of activity (used for the title/emoji only)')
            .setRequired(true)
            .addChoices(
              { name: 'CTA', value: 'CTA' },
              { name: 'Group Dungeon', value: 'Group Dungeon' },
              { name: 'Tracking', value: 'Tracking' },
              { name: 'Ava Dungeon', value: 'Ava Dungeon' },
              { name: 'Other', value: 'Other' }
            )
        )
        .addStringOption((opt) =>
          opt.setName('time').setDescription('When it happens, e.g. "21h Mada"').setRequired(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('comp')
            .setDescription('Saved composition to use (leave blank to type one manually)')
            .setRequired(false)
            .setAutocomplete(true)
        )
        .addStringOption((opt) =>
          opt.setName('title').setDescription('Optional custom title (defaults to the activity type)')
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('close')
        .setDescription('Close an event so people can no longer sign up')
        .addStringOption((opt) =>
          opt.setName('event_id').setDescription('The event ID shown in the embed footer').setRequired(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('refresh')
        .setDescription('Re-apply the current saved comp onto an already-posted event, keeping existing sign-ups')
        .addStringOption((opt) =>
          opt.setName('event_id').setDescription('The event ID shown in the embed footer').setRequired(true)
        )
    ),
  new SlashCommandBuilder()
    .setName('comp')
    .setDescription('Manage reusable team compositions')
    .addSubcommand((sub) =>
      sub.setName('create').setDescription('Create and label a new saved composition')
    )
    .addSubcommand((sub) =>
      sub
        .setName('edit')
        .setDescription('Modify an existing saved composition')
        .addStringOption((opt) =>
          opt
            .setName('comp')
            .setDescription('The composition to edit')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('delete')
        .setDescription('Delete a saved composition')
        .addStringOption((opt) =>
          opt
            .setName('comp')
            .setDescription('The composition to delete')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('List all saved compositions')),
].map((c) => c.toJSON());

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;

    if (guildId) {
      // Guild commands update instantly - best while developing/testing
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands });
      console.log(`Registered commands for guild ${guildId}`);
    } else {
      // Global commands can take up to an hour to propagate
      await rest.put(Routes.applicationCommands(clientId), { body: commands });
      console.log('Registered global commands');
    }
  } catch (err) {
    console.error(err);
  }
})();
