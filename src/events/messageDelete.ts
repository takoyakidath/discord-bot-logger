import { EmbedBuilder, Events, type Message } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.MessageDelete,
  async execute(message: Message): Promise<void> {
    if (!message.guild) return;

    // If the sender is a bot, the process is aborted.
    if (message.author?.bot) return;

    // If the message contains an embed, the process is aborted.
    if (message.embeds.length > 0) return;

    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = message.guild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    const content = message.content || "None";
    let attachmentsInfo = "";
    let attachmentFiles: { attachment: Buffer; name: string }[] = [];

    // If there are attachments, create a list of URLs and get the files in memory.
    if (message.attachments.size > 0) {
      attachmentsInfo = message.attachments.map((att) => att.url).join("\n");

      attachmentFiles = (
        await Promise.all(
          message.attachments.map(async (attachment) => {
            try {
              const response = await fetch(attachment.url);
              if (!response.ok) {
                throw new Error(
                  `Failed to fetch attachment: ${attachment.url}`
                );
              }
              const arrayBuffer = await response.arrayBuffer();
              const buffer = Buffer.from(arrayBuffer);
              return {
                attachment: buffer,
                name: attachment.name || "attachment",
              };
            } catch (error) {
              logger.error(
                message.author?.id,
                `Error fetching attachment ${attachment.url}: ${error}`
              );
              return null;
            }
          })
        )
      ).filter(
        (file): file is { attachment: Buffer; name: string } => file !== null
      );
    }

    const description = `**Message:** ${content}\n**Attachments:** ${
      attachmentsInfo || "None"
    }`;

    const embed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(0xff0000)
      .setDescription(description)
      .addFields(
        {
          name: "User",
          value: message.author?.tag ?? "Unknown",
          inline: true,
        },
        {
          name: "Channel",
          value: `<#${message.channel.id}>`,
          inline: true,
        }
      )
      .setTimestamp();

    // If there are attachments, send them as files.
    await logChannel.send({ embeds: [embed], files: attachmentFiles });
    logger.info(message.author?.id, "The message has been deleted.");
  },
};
