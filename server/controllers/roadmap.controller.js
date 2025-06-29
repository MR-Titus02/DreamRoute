import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateRoadmap = async (req, res) => {
  const { userId } = req.body;

  try {
    const [[user]] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    const [courses] = await db.query("SELECT id, title, description, price, duration, institution_id FROM courses");
    const [institutions] = await db.query("SELECT id, name, address FROM institutions");

    if (!user) {
      return res.status(404).json({ error: "User not found in database." });
    }

    if (courses.length === 0 || institutions.length === 0) {
      return res.status(400).json({
        error: "Required data missing. Please add some courses and institutions first.",
      });
    }

    const courseList = courses
      .map(c => `(${c.id}) ${c.title} - ${c.description} [institution_id: ${c.institution_id}]`)
      .join(",\n");

    const institutionList = institutions
      .map(i => `(${i.id}) ${i.name} - ${i.address}`)
      .join(",\n");

    const messages = [
      {
        role: "system",
        content: "You are a strict JSON generator that returns ONLY raw JSON. No markdown, explanation, or extra text."
      },
      {
        role: "user",
        content: `
Generate a detailed technical career roadmap in valid JSON format only.

User Profile:
- Age: ${user.age}
- Education Level: ${user.educationLevel}
- Location: ${user.location}
- Skills: ${user.skills}
- Career Goal: ${user.careerGoal}
- Budget: ${user.budget}
- Dream Company: ${user.dreamCompany}

INSTRUCTIONS:
- Suggest a suitable career title.
- Return a roadmap with 15–20 main steps.
- Each step must have:
  - "id": string
  - "label": short step title
  - "description": 1–2 line explanation
  - "estimatedTime": how long this step might take (e.g., "2 weeks", "1 month")
  - "details": an array of 3–5 technical subtasks (e.g., "Learn JSX syntax", "Use React Hooks")

FORMAT:
{
  "career": "Suggested Career Title",
  "roadmap": [
    {
      "id": "1",
      "label": "Learn JavaScript Basics",
      "description": "Start with JavaScript syntax and concepts",
      "estimatedTime": "2 weeks",
      "details": [
        { "id": "1.1", "label": "Variables & Types", "description": "Understand let, const, var" },
        { "id": "1.2", "label": "Functions & Scope", "description": "Write reusable JS functions" },
        { "id": "1.3", "label": "DOM Manipulation", "description": "Use JS to manipulate HTML DOM" }
      ]
    },
    ...
  ],
  "courses": [only relevant course objects from this list],
  "institutions": [only matching institutions from this list]
}

ONLY USE:
Courses:
${courseList}

Institutions:
${institutionList}

STRICT RULES:
- Generate 15–20 main roadmap steps only.
- Each must include at least 3 detailed technical subtasks.
- Use only valid course objects from the list above. Do NOT invent.
- Return valid JSON. No explanation or markdown.
`.trim()
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

    // ✅ Map DB courses
    const fullCourseMap = {};
    courses.forEach(course => {
      fullCourseMap[course.id] = course;
    });

    // ✅ Replace and filter invalid courses
    if (Array.isArray(data.courses)) {
      data.courses = data.courses
        .map(aiCourse => fullCourseMap[aiCourse.id])
        .filter(Boolean); // removes undefined/null
    }

    // ✅ Replace roadmap step label using estimatedTime
    data.roadmap = data.roadmap.map(node => {
      if (node.courseId && fullCourseMap[node.courseId]) {
        node.label = `${fullCourseMap[node.courseId].title} - ${node.estimatedTime || "flexible"}`;
      }
      return node;
    });

    // ✅ Filter institutions used in these courses
    const usedInstitutionIds = new Set(data.courses.map(c => c.institution_id));
    data.institutions = institutions.filter(inst => usedInstitutionIds.has(inst.id));

    // 🧪 Debug output (optional)
    console.log("✅ Final Filtered Courses:", data.courses.length);
    console.log("✅ Final Filtered Institutions:", data.institutions.length);

    res.json({
      career: data.career || "Unknown",
      roadmap: data.roadmap,
      courses: data.courses,
      institutions: data.institutions,
    });

  } catch (err) {
    console.error("❌ AI Error:", err?.response?.data || err.message || err);
    res.status(500).json({ error: "Failed to generate roadmap" });
  }
};
