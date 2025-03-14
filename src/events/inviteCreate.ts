import { Events, EmbedBuilder, type Invite } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.InviteCreate,
  async execute(invite: Invite): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const guild = invite.client.guilds.cache.get(invite.guild?.id ?? "");
    if (!guild) return;
    const logChannel = guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle("Invite Created")
      .setColor(0x00ff00)
      .setDescription(
        `New invite link created by ${
          invite.inviter?.username ?? "Unknown"
        } (<@${invite.inviterId ?? "Unknown"}>)`
      )
      .addFields(
        { name: "Invite Code", value: invite.code, inline: true },
        { name: "Channel", value: `<#${invite.channelId}>`, inline: true },
        {
          name: "Expires",
          value: invite.expiresAt
            ? `<t:${Math.floor(invite.expiresAt.getTime() / 1000)}:R>`
            : "Never",
          inline: true,
        },
        {
          name: "Max Uses",
          value: invite.maxUses ? invite.maxUses.toString() : "Unlimited",
          inline: true,
        }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(invite.inviterId ?? "Unknown", "Created new invite link.");
  },
};
