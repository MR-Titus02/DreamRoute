// controllers/openaiController.js
import openai from '../config/aiClient.js'; // ✅ Make sure this line is present

export const generateResponse = async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('OpenAI Error Details:', error);
    res.status(500).json({ error: error.message || 'OpenAI request failed' });
  }
};
