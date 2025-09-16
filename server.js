import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Store key in environment variable
});

app.post("/analyze", async (req, res) => {
  try {
    const { imageData } = req.body;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: "You are an agriculture expert. Detect crop and disease. Respond strictly: Crop:<name>, Disease:<5 words>, Solution:<5 words>."
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this crop image." },
            { type: "image_url", image_url: { url: imageData } }
          ]
        }
      ]
    });

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
