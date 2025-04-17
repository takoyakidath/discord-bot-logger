import {
  Events,
  GuildEmoji,
  EmbedBuilder,
  TextChannel,
  AttachmentBuilder,
} from "discord.js";
import { get } from "https";
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

    const details = [
      `・Name: **${emoji.name}**`,
      `・Animated: **${emoji.animated ? "Yes" : "No"}**`,
      `・ID: **${emoji.id}**`,
    ].join("\n");

    const embed = new EmbedBuilder()
      .setTitle("Emoji Deleted")
      .setColor(0xff0000)
      .setDescription(details)
      .setTimestamp();

    const mainMessage = await logChannel.send({ embeds: [embed] });

    try {
      // Download emoji image
      const fileBuffer = await new Promise<Buffer>((resolve, reject) => {
        get(emoji.imageURL(), (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        }).on("error", reject);
      });

      // Create thread and upload emoji
      const thread = await mainMessage.startThread({
        name: "Deleted Emoji Image",
      });

      const attachment = new AttachmentBuilder(fileBuffer, {
        name: `${emoji.name}.${emoji.animated ? "gif" : "png"}`,
      });
      await thread.send({ files: [attachment] });
    } catch (error: unknown) {
      logger.error(
        "Failed to download emoji:",
        error instanceof Error ? error.message : String(error)
      );
    }
    logger.info(emoji.id, "Emoji deletion logged.");
  },
};
