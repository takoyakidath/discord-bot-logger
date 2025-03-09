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

    // Extract only images from attachments (if contentType is available or determine by extension)
    const imageAttachments = message.attachments.filter((attachment) => {
      return (
        (attachment.contentType &&
          attachment.contentType.startsWith("image/")) ||
        /\.(jpg|jpeg|png|gif)$/i.test(attachment.url)
      );
    });
    const imageUrls = imageAttachments.map((att) => att.url);
    const attachmentsInfo = imageUrls.join("\n") || "None";

    const description = `**Message:** ${content}\n**Image Attachments:** ${attachmentsInfo}`;

    const embeds = [];
    const mainEmbed = new EmbedBuilder()
      .setTitle("Message Deleted")
      .setColor(0xff0000)
      .setDescription(description)
      .addFields(
        {
          name: "User",
          value: `${message.author.username ?? "Unknown"} (<@${
            message.author.id
          }>)`,
          inline: true,
        },
        { name: "Channel", value: `<#${message.channel.id}>`, inline: true }
      )
      .setTimestamp();

    // If there is only one image, set it to the image of the main embed
    if (imageUrls.length === 1) {
      mainEmbed.setImage(imageUrls[0]);
    }
    embeds.push(mainEmbed);

    // If there are multiple images, create an embed for each image (display all separately from the main embed)
    if (imageUrls.length > 1) {
      for (const url of imageUrls) {
        const imageEmbed = new EmbedBuilder().setColor(0xff0000).setImage(url);
        embeds.push(imageEmbed);
      }
    }

    await logChannel.send({ embeds });
    logger.info(message.author?.id, "The message has been deleted.");
  },
};
