import { Events, GuildMember, EmbedBuilder } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildMemberUpdate,
  async execute(oldMember: GuildMember, newMember: GuildMember): Promise<void> {
    if (!newMember.guild) return;
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = newMember.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const oldRoles = oldMember.roles.cache;
    const newRoles = newMember.roles.cache;

    const addedRoles = newRoles.filter((role) => !oldRoles.has(role.id));
    const removedRoles = oldRoles.filter((role) => !newRoles.has(role.id));

    // Detect nickname changes (use username if undefined)
    const oldNickname = oldMember.nickname || oldMember.user.username;
    const newNickname = newMember.nickname || newMember.user.username;
    const nicknameChanged = oldNickname !== newNickname;

    const oldTimeout = oldMember.communicationDisabledUntilTimestamp;
    const newTimeout = newMember.communicationDisabledUntilTimestamp;
    const hasTimeoutChanged = oldTimeout !== newTimeout;

    // Do nothing if there are no changes
    if (
      addedRoles.size === 0 &&
      removedRoles.size === 0 &&
      !nicknameChanged &&
      !hasTimeoutChanged
    )
      return;

    const embed = new EmbedBuilder().setColor(0x00ffff).setTimestamp();

    if (hasTimeoutChanged) {
      if (newTimeout && newTimeout > Date.now()) {
        embed.addFields({
          name: "Timeout",
          value: `User timed out until <t:${Math.floor(newTimeout / 1000)}:F>.`,
        });
      } else if (oldTimeout && oldTimeout > Date.now()) {
        embed.addFields({
          name: "Timeout",
          value: "User is no longer timed out.",
        });
      }
    }

    if (addedRoles.size > 0) {
      embed.addFields({
        name: "Roles Added",
        value: addedRoles.map((role) => role.name).join(", ") || "None",
        inline: false,
      });
    }
    if (removedRoles.size > 0) {
      embed.addFields({
        name: "Roles Removed",
        value: removedRoles.map((role) => role.name).join(", ") || "None",
        inline: false,
      });
    }
    if (nicknameChanged) {
      embed.addFields({
        name: "Nickname Changed",
        value: `Before: **${oldNickname}**\nAfter: **${newNickname}**`,
        inline: false,
      });
    }

    embed.setTitle(
      `Update for ${newMember.user.username} (<@${newMember.user.id}>)`
    );

    await logChannel.send({ embeds: [embed] });
    logger.info(newMember.user.id, "Guild member update logged.");
  },
};
