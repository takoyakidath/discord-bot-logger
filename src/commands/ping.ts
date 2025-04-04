import {
  type ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
  PermissionFlagsBits,
} from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Returns the response speed to the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      let ping: number = interaction.client.ws.ping;
      ping = Math.min(ping > 0 ? ping : 0, 999);

      const embed = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle("Pong!")
        .setDescription(`WebSocket Ping: ${ping}ms\nAPI Endpoint Ping: ...`);
      const msg = await interaction.reply({
        embeds: [embed],
        fetchReply: true,
      });

      const apiPing = Math.min(
        msg.createdTimestamp - interaction.createdTimestamp,
        999
      );

      embed.setDescription(
        `WebSocket Ping: ${ping}ms\nAPI Endpoint Ping: ${apiPing}ms`
      );
      await interaction.editReply({ embeds: [embed] });
    } catch (err: any) {
      console.error(err);
    }
  },
};
