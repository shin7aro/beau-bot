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
            .setDescription('Type of activity — PVP, PVE, or Economy')
            .setRequired(true)
            .addChoices(
              { name: 'PVP', value: 'PVP' },
              { name: 'PVE', value: 'PVE' },
              { name: 'Economy', value: 'Economy' }
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
        .addStringOption((opt) =>
          opt.setName('mass').setDescription('Optional meeting point / portal, e.g. "Lymhurst Portal"')
        )
        .addStringOption((opt) =>
          opt.setName('sets').setDescription('Optional gear reminder, e.g. "1+0"')
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
    )
    .addSubcommand((sub) =>
      sub
        .setName('edit')
        .setDescription('Edit an already-posted event\'s details (organizer or server manager only)')
        .addStringOption((opt) =>
          opt.setName('event_id').setDescription('The event ID shown in the embed footer').setRequired(true)
        )
        .addStringOption((opt) => opt.setName('title').setDescription('New title'))
        .addStringOption((opt) => opt.setName('time').setDescription('New time, e.g. "21h Mada"'))
        .addStringOption((opt) =>
          opt
            .setName('type')
            .setDescription('New activity type — PVP, PVE, or Economy')
            .addChoices(
              { name: 'PVP', value: 'PVP' },
              { name: 'PVE', value: 'PVE' },
              { name: 'Economy', value: 'Economy' }
            )
        )
        .addStringOption((opt) => opt.setName('mass').setDescription('New meeting point / portal (leave a single space to clear)'))
        .addStringOption((opt) => opt.setName('sets').setDescription('New gear reminder (leave a single space to clear)'))
        .addStringOption((opt) =>
          opt
            .setName('comp')
            .setDescription('Swap in a different saved composition, keeping matching sign-ups')
            .setAutocomplete(true)
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
    .addSubcommand((sub) =>
      sub
        .setName('view')
        .setDescription('See the full roster for one saved composition')
        .addStringOption((opt) =>
          opt
            .setName('comp')
            .setDescription('The composition to view')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) => sub.setName('list').setDescription('List all saved compositions')),
  new SlashCommandBuilder()
    .setName('giveaway')
    .setDescription("Draw winners from an event's attendees")
    .addStringOption((opt) =>
      opt.setName('event_id').setDescription('The event ID shown in the embed footer').setRequired(true)
    )
    .addStringOption((opt) => opt.setName('prize').setDescription('What the winner(s) get').setRequired(true))
    .addIntegerOption((opt) =>
      opt.setName('winners').setDescription('How many winners to draw (default 1)').setRequired(false)
    ),
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
