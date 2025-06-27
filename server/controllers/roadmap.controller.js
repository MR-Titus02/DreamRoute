import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateRoadmap = async (req, res) => {
  const { userId } = req.body;

  try {
    const [[user]] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    const [courses] = await db.query("SELECT id, title, description FROM courses");
    const [institutions] = await db.query("SELECT id, name, address FROM institutions");

    if (!user) {
      return res.status(404).json({ error: "User not found in database." });
    }

    if (courses.length === 0 || institutions.length === 0) {
      return res.status(400).json({
        error: "Required data missing. Please add some courses and institutions first."
      });
    }

    const courseList = courses.map(c => `(${c.id}) ${c.title}`).join(", ");
    const institutionList = institutions.map(i => `(${i.id}) ${i.name} - ${i.address}`).join(", ");

    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that returns structured JSON career roadmaps only.",
      },
      {
        role: "user",
        content: `
User:
- Age: ${user.age}
- Education Level: ${user.educationLevel}
- Location: ${user.location}
- Skills: ${user.skills}
- Goal: ${user.careerGoal}
- Budget: ${user.budget}
- Dream Company: ${user.dreamCompany}

Return ONLY a JSON object in this format:

{
  "roadmap": [
    { "id": "1", "label": "Start", "description": "Intro", "month": 1 },
    ...
  ],
  "courses": [3 best matching course objects],
  "institutions": [2 best matching institution objects]
}

Use only these courses: ${courseList}
Use only these institutions: ${institutionList}
        `.trim(),
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages,
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    try {
      const data = JSON.parse(result);
      res.json(data);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", result);
      return res.status(500).json({ error: "OpenAI returned invalid JSON." });
    }

  } catch (err) {
    console.error("❌ AI Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};
