import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateRoadmap = async (req, res) => {
  const { userId } = req.body;

  try {
    const [[user]] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    const [courses] = await db.query("SELECT id, title, description, institution_id FROM courses");
    const [institutions] = await db.query("SELECT id, name, address FROM institutions");

    if (!user) {
      return res.status(404).json({ error: "User not found in database." });
    }

    if (courses.length === 0 || institutions.length === 0) {
      return res.status(400).json({
        error: "Required data missing. Please add some courses and institutions first.",
      });
    }

    // 🔄 Better course formatting (with institution ID info)
    const courseList = courses.map(c =>
      `(${c.id}) ${c.title} - ${c.description} [institution_id: ${c.institution_id}]`
    ).join(",\n");

    // 🔄 Institution formatting
    const institutionList = institutions.map(i =>
      `(${i.id}) ${i.name} - ${i.address}`
    ).join(",\n");

    // ✅ Improved prompt
    const messages = [
      {
        role: "system",
        content: "You are a helpful assistant that returns strictly valid JSON career roadmaps only.",
      },
      {
        role: "user",
        content: `
You are a strict JSON generator. Return ONLY raw JSON. No markdown, explanations, or extra text.

User Profile:
- Age: ${user.age}
- Education Level: ${user.educationLevel}
- Location: ${user.location}
- Skills: ${user.skills}
- Career Goal: ${user.careerGoal}
- Budget: ${user.budget}
- Dream Company: ${user.dreamCompany}

Return a JSON response in the following format:

{
  "career": "Suggested Career Title",
  "roadmap": [
    { "id": "1", "label": "Explore Careers", "description": "Research tech fields and roles", "month": 1 },
    { "id": "2", "label": "Course: JavaScript Basics", "description": "Learn JS", "month": 2, "courseId": 4 },
    ...
  ],
  "courses": [3 matching course objects from the list below],
  "institutions": [2 matching institution objects from the list below]
}

Use only these courses (with their institution_id):
${courseList}

Use only these institutions:
${institutionList}

IMPORTANT:
- Match each course with its real institution (based on institution_id).
- Do NOT include institutionId in roadmap steps.
- Return raw, valid JSON only. No explanations, markdown, or code blocks.
`.trim(),
      },
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

    // 🔄 Build map of courseId → course
    const fullCourseMap = {};
    courses.forEach(course => {
      fullCourseMap[course.id] = course;
    });

    // ✅ Replace minimal AI course data with real DB course data
    if (Array.isArray(data.courses)) {
      data.courses = data.courses.map(aiCourse => {
        return fullCourseMap[aiCourse.id] || aiCourse;
      });
    }

    // ✅ Replace roadmap node labels using actual course titles
    data.roadmap = data.roadmap.map(node => {
      if (node.courseId && fullCourseMap[node.courseId]) {
        node.label = `${fullCourseMap[node.courseId].title} (${node.month} months)`;
      }
      return node;
    });

    // ✅ Filter institutions to only those used in selected courses
    const usedInstitutionIds = new Set(data.courses.map(c => c.institution_id));
    data.institutions = institutions.filter(inst => usedInstitutionIds.has(inst.id));

    // ✅ Send final JSON response
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
