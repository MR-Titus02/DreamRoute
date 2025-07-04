import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithBot = async (req, res) => {
  const { message, userId } = req.body;

  if (!message || !userId) {
    return res.status(400).json({ reply: "Missing message or user ID." });
  }

  // System prompt gives AI knowledge about your app
  const systemPrompt = `
You are an AI assistant for the DreamRoute Career Guidance Web App.

You are designed to help users:
- Understand how to generate their career roadmap
- Explore courses and institutions
- Get career recommendations
- Provide feedback or ask questions about the platform

Current user ID: ${userId}

Guidelines:
- Be friendly, concise, and helpful
- Only talk about things related to the platform
- If unsure about something, say: "I'm not sure about that, but I can help you explore further."
-Give response briefly, try to avoid unnecessary stuffs
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
    });

    const aiReply = response.choices[0].message.content.trim();
    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    return res.status(500).json({ reply: "Sorry, something went wrong." });
  }
};
