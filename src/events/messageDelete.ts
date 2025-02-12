import { EmbedBuilder, Events, type Message } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.MessageDelete,
  async execute(message: Message): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId || !message.guild) return;
    const logChannel = message.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const content = message.content || "Message with attachments only";
    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(0xff0000)
      .addFields(
        { name: "User", value: message.author?.tag ?? "Unknown" },
        { name: "Content", value: content }
      )
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(message.author?.id, "The message has been deleted.");
  },
};
