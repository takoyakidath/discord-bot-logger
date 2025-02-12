import { Events, Guild, EmbedBuilder } from "discord.js";
import logger from "~/utils/logger";

export default {
  name: Events.GuildUpdate,
  async execute(oldGuild: Guild, newGuild: Guild): Promise<void> {
    const channelId = process.env.CHANNEL_ID;
    if (!channelId) return;
    const logChannel = newGuild.channels.cache.get(channelId);
    if (!logChannel || !logChannel.isTextBased()) return;

    let changes = "";

    // Basic Information Changes
    if (oldGuild.name !== newGuild.name) {
      changes += `・Name Change:\n  Before: **${oldGuild.name}**\n  After : **${newGuild.name}**\n`;
    }
    if (oldGuild.icon !== newGuild.icon) {
      changes += `・Icon has been updated.\n`;
    }
    if (oldGuild.banner !== newGuild.banner) {
      changes += `・Banner has been updated.\n`;
    }
    if (oldGuild.splash !== newGuild.splash) {
      changes += `・Splash Image Change: **${oldGuild.splash || "None"}** → **${
        newGuild.splash || "None"
      }**\n`;
    }
    if (oldGuild.discoverySplash !== newGuild.discoverySplash) {
      changes += `・Discovery Splash Change: **${
        oldGuild.discoverySplash || "None"
      }** → **${newGuild.discoverySplash || "None"}**\n`;
    }
    if (oldGuild.description !== newGuild.description) {
      changes += `・Description Change: **${
        oldGuild.description || "None"
      }** → **${newGuild.description || "None"}**\n`;
    }

    // AFK Settings Changes
    if (oldGuild.afkChannelId !== newGuild.afkChannelId) {
      changes += `・AFK Channel Change: **${
        oldGuild.afkChannelId || "None"
      }** → **${newGuild.afkChannelId || "None"}**\n`;
    }
    if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
      changes += `・AFK Timeout Change: **${oldGuild.afkTimeout}** → **${newGuild.afkTimeout}**\n`;
    }

    // System Channel, Rules Channel, Public Updates Channel
    if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
      changes += `・System Channel Change: **${
        oldGuild.systemChannelId || "None"
      }** → **${newGuild.systemChannelId || "None"}**\n`;
    }
    if (oldGuild.rulesChannelId !== newGuild.rulesChannelId) {
      changes += `・Rules Channel Change: **${
        oldGuild.rulesChannelId || "None"
      }** → **${newGuild.rulesChannelId || "None"}**\n`;
    }
    if (oldGuild.publicUpdatesChannelId !== newGuild.publicUpdatesChannelId) {
      changes += `・Public Updates Channel Change: **${
        oldGuild.publicUpdatesChannelId || "None"
      }** → **${newGuild.publicUpdatesChannelId || "None"}**\n`;
    }

    // Locale, Verification, Content Filter, Message Notifications, MFA Level
    if (oldGuild.preferredLocale !== newGuild.preferredLocale) {
      changes += `・Preferred Locale Change: **${oldGuild.preferredLocale}** → **${newGuild.preferredLocale}**\n`;
    }
    if (oldGuild.verificationLevel !== newGuild.verificationLevel) {
      changes += `・Verification Level Change: **${oldGuild.verificationLevel}** → **${newGuild.verificationLevel}**\n`;
    }
    if (oldGuild.explicitContentFilter !== newGuild.explicitContentFilter) {
      changes += `・Explicit Content Filter Change: **${oldGuild.explicitContentFilter}** → **${newGuild.explicitContentFilter}**\n`;
    }
    if (
      oldGuild.defaultMessageNotifications !==
      newGuild.defaultMessageNotifications
    ) {
      changes += `・Default Message Notifications Change: **${oldGuild.defaultMessageNotifications}** → **${newGuild.defaultMessageNotifications}**\n`;
    }
    if (oldGuild.mfaLevel !== newGuild.mfaLevel) {
      changes += `・MFA Level Change: **${oldGuild.mfaLevel}** → **${newGuild.mfaLevel}**\n`;
    }
    if ((oldGuild as any).nsfwLevel !== (newGuild as any).nsfwLevel) {
      changes += `・NSFW Level Change: **${(oldGuild as any).nsfwLevel}** → **${
        (newGuild as any).nsfwLevel
      }**\n`;
    }

    // Premium Tier, Premium Subscription Count, Premium Progress Bar Enabled
    if (oldGuild.premiumTier !== newGuild.premiumTier) {
      changes += `・Premium Tier Change: **${oldGuild.premiumTier}** → **${newGuild.premiumTier}**\n`;
    }
    if (
      oldGuild.premiumSubscriptionCount !== newGuild.premiumSubscriptionCount
    ) {
      changes += `・Premium Subscription Count Change: **${oldGuild.premiumSubscriptionCount}** → **${newGuild.premiumSubscriptionCount}**\n`;
    }
    if (
      (oldGuild as any).premiumProgressBarEnabled !==
      (newGuild as any).premiumProgressBarEnabled
    ) {
      changes += `・Premium Progress Bar Enabled Change: **${
        (oldGuild as any).premiumProgressBarEnabled
      }** → **${(newGuild as any).premiumProgressBarEnabled}**\n`;
    }

    // Emoji & Feature Changes
    if (oldGuild.emojis.cache.size !== newGuild.emojis.cache.size) {
      changes += `・Emoji Count Change: **${oldGuild.emojis.cache.size}** → **${newGuild.emojis.cache.size}**\n`;
    }
    if (oldGuild.features.length !== newGuild.features.length) {
      changes += `・Feature Count Change: **${oldGuild.features.length}** → **${newGuild.features.length}**\n`;
    }
    if (oldGuild.vanityURLCode !== newGuild.vanityURLCode) {
      changes += `・Vanity URL Code Change: **${
        oldGuild.vanityURLCode || "None"
      }** → **${newGuild.vanityURLCode || "None"}**\n`;
    }

    if (!changes) return;

    const embed = new EmbedBuilder()
      .setTitle("Server Settings Changed")
      .setColor(0x00ffff)
      .setDescription(changes)
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
    logger.info(newGuild.id, "Guild update logged.");
  },
};
