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
        error: "Required data missing. Please add some courses and institutions first.",
      });
    }

    const courseList = courses.map(c => `(${c.id}) ${c.title}`).join(", ");
    const institutionList = institutions.map(i => `(${i.id}) ${i.name} - ${i.address}`).join(", ");

    // ✅ Update prompt: only use courseId in roadmap; institutions listed separately
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
  "career": "Suggested Career Title",
  "roadmap": [
    { "id": "1", "label": "Start", "description": "Intro", "month": 1 },
    { "id": "2", "label": "Course: Learn React", "description": "React basics", "month": 2, "courseId": 3 },
    ...
  ],
  "courses": [3 best matching course objects],
  "institutions": [2 best matching institution objects]
}

Use only these courses: ${courseList}
Use only these institutions: ${institutionList}

IMPORTANT: Do NOT include institutionId in roadmap nodes. Only use "courseId" if a roadmap step is based on a course.
Institutions should appear only in the "institutions" array at the bottom.
        `.trim(),
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages,
      temperature: 0.7,
    });

    const result = completion.choices[0].message.content;

    let data;
    try {
      data = JSON.parse(result);
    } catch (parseError) {
      console.error("❌ JSON Parse Error:", result);
      return res.status(500).json({ error: "OpenAI returned invalid JSON." });
    }

    const courseMap = {};
    courses.forEach(course => {
      courseMap[course.id] = course.title;
    });

    // ✅ Only replace roadmap labels based on courseId
    data.roadmap = data.roadmap.map(node => {
      if (node.courseId && courseMap[node.courseId]) {
        node.label = `${courseMap[node.courseId]} (${node.month} months)`;
      }
      return node;
    });

    // ✅ Return response with roadmap (only course names) and institutions below
    res.json({
      career: data.career || "Unknown",
      roadmap: data.roadmap,
      courses: data.courses || [],
      institutions: data.institutions || [],
    });

  } catch (err) {
    console.error("❌ AI Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};
