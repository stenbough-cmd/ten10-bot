import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

// Discord bot setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.login(DISCORD_TOKEN);

// POST endpoint
app.post("/post", async (req, res) => {
  try {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const { content, embed } = req.body;

    if (embed) {
      await channel.send({ embeds: [embed] });
    } else {
      await channel.send(content || "No content received.");
    }

    res.json({ status: "ok" });
  } catch (err) {
    console.error("Error posting to Discord:", err);
    res.status(500).json({ error: "Failed to post" });
  }
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Bot is listening on port " + PORT));
});
