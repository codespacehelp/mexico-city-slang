import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

app.get("/", (req, res) => {
  // Serve the "index.html" file
  res.sendFile(path.join("public", "index.html"));
});

app.post("/complete", async (req, res) => {
  const requestBody = req.body;
  console.log(`Request`, requestBody);
  const { message } = req.body;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a translator from English to Mexico City slang Spanish. Here are a couple of terms that we use:\n\nOkay - Camera\nDude - Wiy\nBuddy - Carnal\nGay - Deonda\n\nGiven an english phrase, please only provide the reply, with no additional text.",
      },
      {
        role: "user",
        content: message,
      },
    ],
    temperature: 1,
    max_tokens: 256,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  res.json({ response: response.choices[0].message.content });
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
