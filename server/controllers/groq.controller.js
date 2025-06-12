import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const chatWithGroq = async (req, res) => {
  try {
    const { model, messages } = req.body;

    // ✅ Input validation
    if (!model || !Array.isArray(messages) || !messages[0]?.content) {
      return res.status(400).json({ error: 'Model and valid messages are required' });
    }

    // ✅ Call Groq API
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model,
        messages
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        }
      }
    );

    // ✅ Send Groq's response to the client
    res.json(response.data);
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.error?.message || error.message
    });
  }
};
