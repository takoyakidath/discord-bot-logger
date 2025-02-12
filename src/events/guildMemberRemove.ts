import {
  Events,
  EmbedBuilder,
  type GuildMember,
  AuditLogEvent,
} from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildMemberRemove,
  async execute(member: GuildMember): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId || !member.guild) return;
    const logChannel = member.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    // Detect Kick from audit logs
    try {
      const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 1,
        type: AuditLogEvent.MemberKick,
      });
      const kickLog = fetchedLogs.entries.first();
      if (kickLog && kickLog.target?.id === member.id) {
        const embed = new EmbedBuilder()
          .setTitle("Member Kicked")
          .setColor(0xffa500)
          .setDescription(
            `${member.user.tag} (${member.user.id}) was kicked.\nReason: ${
              kickLog.reason || "No reason provided"
            }`
          )
          .setTimestamp();
        await logChannel.send({ embeds: [embed] });
        logger.info(member.user.id, "Member kick logged.");
        return;
      }
    } catch (err) {
      console.error(err);
    }

    // If not kicked, send a leave log
    const embed = new EmbedBuilder()
      .setTitle("Member Left")
      .setColor(0xff0000)
      .setDescription(`${member.user.tag} left the server.`)
      .setTimestamp();
    await logChannel.send({ embeds: [embed] });
    logger.info(member.user.id, "Member left logged.");
  },
};
