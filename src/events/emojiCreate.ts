import { Events, GuildEmoji, EmbedBuilder, TextChannel } from "discord.js";
import logger from "~/utils/logger";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import https from "https";

export default {
  name: Events.GuildEmojiCreate,
  async execute(emoji: GuildEmoji): Promise<void> {
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

    // Ensure emoji_logs directory exists
    const emojiDir = join(process.cwd(), "emoji_logs");
    await mkdir(emojiDir, { recursive: true }).catch(console.error);
    await writeFile(
      join(emojiDir, `${emoji.id}.${emoji.animated ? "gif" : "png"}`),
      await new Promise<Buffer>((resolve, reject) => {
        https.get(emoji.url, (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (chunk) => chunks.push(chunk));
          res.on("end", () => resolve(Buffer.concat(chunks)));
          res.on("error", reject);
        });
      })
    ).catch(console.error);

    const embed = new EmbedBuilder()
      .setTitle("Emoji Created")
      .setColor(0x00ff00)
      .setDescription(details)
      .setImage(emoji.url)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(emoji.id, "Emoji creation logged.");
  },
};
