import express from "express";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

// Discord bot setup
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.once("ready", () => {
  console.log("Discord bot is online");
});

// POST endpoint for standings
app.post("/post", async (req, res) => {
  try {
    const channel = await client.channels.fetch(process.env.CHANNEL_ID);
    await channel.send(req.body.content || "No content received");
    res.status(200).send("Message sent");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending message");
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
