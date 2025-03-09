import {
  AttachmentBuilder,
  EmbedBuilder,
  Events,
  type Message,
} from "discord.js";
import { get } from "https";
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
    // Download and prepare images
    interface ImageData {
      buffer: Buffer;
      filename: string;
    }
    const imageDataArray: ImageData[] = [];
    for (const attachment of imageAttachments.values()) {
      try {
        const imageData = await new Promise<Buffer>((resolve, reject) => {
          get(attachment.url, (res) => {
            const chunks: Buffer[] = [];
            res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            res.on("end", () => resolve(Buffer.concat(chunks)));
            res.on("error", reject);
          }).on("error", reject);
        });

        const filename =
          attachment.name ||
          "image." + (attachment.contentType?.split("/")[1] || "png");

        // Store the image data for later upload
        imageDataArray.push({ buffer: imageData, filename });
      } catch (error: unknown) {
        logger.error(
          "Failed to download image:",
          error instanceof Error ? error.message : String(error)
        );
      }
    }

    const hasImages = imageDataArray.length > 0;
    const attachmentsInfo = hasImages ? "Image in thread." : "None";
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

    embeds.push(mainEmbed);

    const mainMessage = await logChannel.send({ embeds: [mainEmbed] });

    // If there are images, create a thread and upload them there
    if (hasImages) {
      const thread = await mainMessage.startThread({
        name: "Deleted Message Images",
      });

      // Upload all images to the thread
      for (const { buffer, filename } of imageDataArray) {
        const attachmentBuilder = new AttachmentBuilder(buffer, {
          name: filename,
        });
        await thread.send({ files: [attachmentBuilder] });
      }
    }
    logger.info(message.author?.id, "The message has been deleted.");
  },
};
