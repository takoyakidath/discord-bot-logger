import { EmbedBuilder, Events, type Message } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.MessageDelete,
  async execute(message: Message): Promise<void> {
    if (!message.guild) return;
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = message.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const content = message.content || "None";
    let attachments = "";
    if (message.attachments.size > 0) {
      attachments = message.attachments.map((att) => att.url).join("\n");
    }

    const description = `**Message:** ${content}\n**Attachments:** ${
      attachments || "None"
    }`;

    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(0xff0000)
      .setDescription(description)
      .addFields({
        name: "User",
        value: message.author?.tag ?? "Unknown",
        inline: true,
      })
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(message.author?.id, "The message has been deleted.");
  },
};
