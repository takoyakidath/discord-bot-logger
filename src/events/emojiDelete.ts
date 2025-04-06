import { Events, GuildEmoji, EmbedBuilder, TextChannel } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildEmojiDelete,
  async execute(emoji: GuildEmoji): Promise<void> {
    logger.info(emoji.id, `Emoji deletion started: ${emoji.name}`);
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = emoji.client.channels.cache.get(
      channelId
    ) as TextChannel;
    if (!logChannel) return;

    let details = "";

    // Add emoji details
    details += `・Name: **${emoji.name}**\n`;
    details += `・Animated: **${emoji.animated ? "Yes" : "No"}**\n`;
    details += `・ID: **${emoji.id}**\n`;

    const embed = new EmbedBuilder()
      .setTitle("Emoji Deleted")
      .setColor(0xff0000)
      .setDescription(details)
      .setImage(emoji.url)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(emoji.id, "Emoji deletion logged.");
  },
};
