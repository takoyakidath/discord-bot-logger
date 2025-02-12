import { Events, EmbedBuilder, type GuildMember } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildMemberAdd,
  async execute(member: GuildMember): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId || !member.guild) return;
    const logChannel = member.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle("Member Joined")
      .setColor(0x00ff00)
      .setDescription(`${member.user.tag} joined the server.`)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(member.user.id, "Member joined the server.");
  },
};
