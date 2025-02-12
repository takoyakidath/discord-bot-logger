import { Events, EmbedBuilder, type GuildMember } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId || !member.guild) return;
    const logChannel = member.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle("Member Left")
      .setColor(0xff0000)
      .setDescription(`${member.user.tag} left the server.`)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(member.user.id, "Member left the server.");
  },
};
