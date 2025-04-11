import { Events, GuildEmoji, EmbedBuilder, TextChannel } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildEmojiUpdate,
  async execute(oldEmoji: GuildEmoji, newEmoji: GuildEmoji): Promise<void> {
    logger.info(
      newEmoji.id,
      `Emoji update started: ${oldEmoji.name} -> ${newEmoji.name}`
    );
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = newEmoji.client.channels.cache.get(
      channelId
    ) as TextChannel;
    if (!logChannel) return;

    const details = [
      "**Old Details:**",
      `・Name: **${oldEmoji.name}**`,
      `・Animated: **${oldEmoji.animated ? "Yes" : "No"}**`,
      `・ID: **${oldEmoji.id}**`,
      "\n**New Details:**",
      `・Name: **${newEmoji.name}**`,
      `・Animated: **${newEmoji.animated ? "Yes" : "No"}**`,
      `・ID: **${newEmoji.id}**`,
    ].join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Emoji Updated")
      .setColor(0xffaa00)
      .setDescription(details)
      .setThumbnail(newEmoji.imageURL())
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(newEmoji.id, "Emoji update logged.");
  },
};
