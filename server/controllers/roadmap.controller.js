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

    const courseList = courses.map(c => `(${c.id}) ${c.name}`).join(", ");
    const institutionList = institutions.map(i => `(${i.id}) ${i.name} - ${i.location}`).join(", ");

    const prompt = `
You are a career roadmap assistant.

User:
- Age: ${user.age}
- Education Level: ${user.educationLevel}
- Location: ${user.location}
- Skills: ${user.skills}
- Goal: ${user.careerGoal}
- Budget: ${user.budget}
- Dream Company: ${user.dreamCompany}

Return:
{
  "roadmap": [
    { "id": "1", "label": "Start", "description": "Intro", "month": 1 }
  ],
  "courses": [ ...3 relevant course objects... ],
  "institutions": [ ...2 relevant institution objects... ]
}
From this course list: ${courseList}
From this institution list: ${institutionList}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You generate JSON-formatted career roadmaps." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;
    const data = JSON.parse(result);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};
