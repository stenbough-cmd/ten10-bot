import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

// Discord bot setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// Track whether the bot is ready
let botReady = false;
client.once("ready", () => {
  botReady = true;
  console.log("Discord bot is online");
});

// Wait for bot to be ready (handles cold start race condition)
function waitForBot(timeoutMs = 15000) {
  if (botReady) return Promise.resolve();
  console.log("Bot not ready yet, waiting...");
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Bot ready timeout")), timeoutMs);
    client.once("ready", () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

// POST endpoint for standings
app.post("/post", async (req, res) => {
  try {
    const { channel, content } = req.body;

    if (!channel) {
      return res.status(400).send("Missing 'channel' in request body");
    }

    await waitForBot();

    const discordChannel = await client.channels.fetch(channel);
    await discordChannel.send(content || "No content received");

    res.status(200).send("Message sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message: " + err.message);
  }
});

// REQUIRED: Cloud Run health check
app.get("/", (req, res) => {
  res.status(200).send("Ten10 bot is running");
});

// REQUIRED: Cloud Run port binding
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log("Server listening on port " + PORT);
});

// Login Discord bot
client.login(process.env.DISCORD_TOKEN);
