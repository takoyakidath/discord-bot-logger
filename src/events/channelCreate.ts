import {
  Events,
  GuildChannel,
  EmbedBuilder,
  ChannelType,
  TextChannel,
} from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.ChannelCreate,
  async execute(channel: GuildChannel): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = channel.client.channels.cache.get(
      channelId
    ) as TextChannel;
    if (!logChannel) return;

    let details = "";

    // Add channel name
    details += `・Name: **${channel.name}**\n`;

    // Add channel type
    details += `・Type: **${ChannelType[channel.type]}**\n`;

    // Add channel position if available
    if ("position" in channel) {
      details += `・Position: **${channel.position}**\n`;
    }

    // Add parent category if available
    if ("parent" in channel && channel.parent) {
      details += `・Category: **${channel.parent.name}**\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle("Channel Created")
      .setColor(0x00ff00)
      .setDescription(details)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(channel.id, "Channel creation logged.");
  },
};
