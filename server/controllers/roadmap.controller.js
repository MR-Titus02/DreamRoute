import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateRoadmap = async (req, res) => {
  const { userId } = req.body;

  try {
    // Fetch user, courses, institutions
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

    // Check if roadmap already exists
    const [existingRoadmaps] = await db.query("SELECT * FROM roadmaps WHERE user_id = ?", [userId]);

    if (existingRoadmaps.length > 0) {
      const roadmapId = existingRoadmaps[0].id;
      const [steps] = await db.query("SELECT * FROM roadmap_steps WHERE roadmap_id = ?", [roadmapId]);

      for (const step of steps) {
        const [details] = await db.query("SELECT * FROM step_details WHERE roadmap_step_id = ?", [step.id]);
        step.details = details;
      }

      const courseIds = steps.map(s => s.course_id).filter(Boolean);
      const usedCourses = courses.filter(c => courseIds.includes(c.id));
      const usedInstitutionIds = [...new Set(usedCourses.map(c => c.institution_id))];
      const usedInstitutions = institutions.filter(i => usedInstitutionIds.includes(i.id));

      return res.json({
        career: existingRoadmaps[0].career,
        roadmap: steps,
        courses: usedCourses,
        institutions: usedInstitutions,
      });
    }

    // No roadmap exists — generate via OpenAI
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
  - "details": an array of 3–5 technical subtasks, each with:
      - "id": unique string
      - "label": short subtask title
      - "description": what the user will study in that subtask

FORMAT:
{
  "career": "Suggested Career Title",
  "roadmap": [...],
  "courses": [only relevant course objects from this list],
  "institutions": [only matching institutions from this list]
}

ONLY USE:
Courses:
${courseList}

Institutions:
${institutionList}

If the user’s profile clearly aligns with another field (e.g. cybersecurity, data science, mobile development), prefer suggesting that over Full Stack Development.
        `.trim()
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
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

    // Map courses for quick lookup
    const fullCourseMap = {};
    courses.forEach(course => {
      fullCourseMap[course.id] = course;
    });

    // Filter AI courses to full course objects from DB
    if (Array.isArray(data.courses)) {
      data.courses = data.courses
        .map(aiCourse => fullCourseMap[aiCourse.id])
        .filter(Boolean);
    }

    // Process roadmap steps and their details
    data.roadmap = data.roadmap.map((node, idx) => {
      // Validate and clean step.details
      if (!Array.isArray(node.details)) node.details = [];

      node.details = node.details.filter(
        d => d && typeof d === "object" && (d.label || d.id) && d.description
      );

      // If no valid subtasks, create a default one based on step description
      if (node.details.length === 0) {
        node.details = [
          {
            id: `note-${node.id}`,
            label: "Overview",
            description: node.description || "No breakdown available."
          }
        ];
      } else {
        // Ensure each subtask has unique id and label
        node.details = node.details.map((d, i) => ({
          id: (d.id || `sub-${node.id}-${i}`).slice(0, 50), 
          label: d.label || `Subtask ${i + 1}`,
          description: d.description
        }));
      }

      // Rename label if courseId exists for clarity
      if (node.courseId && fullCourseMap[node.courseId]) {
        node.label = `${fullCourseMap[node.courseId].title} - ${node.estimatedTime || "flexible"}`;
      }

      return node;
    });

    // Filter institutions based on courses used
    const usedInstitutionIds = new Set(data.courses.map(c => c.institution_id));
    data.institutions = institutions.filter(inst => usedInstitutionIds.has(inst.id));

    // Save new roadmap in DB
    const [roadmapInsert] = await db.query(
      "INSERT INTO roadmaps (user_id, career) VALUES (?, ?)",
      [userId, data.career || "Unknown"]
    );
    const roadmapId = roadmapInsert.insertId;

    for (const step of data.roadmap) {
      const [stepResult] = await db.query(
        "INSERT INTO roadmap_steps (roadmap_id, step_id, label, description, estimated_time, course_id) VALUES (?, ?, ?, ?, ?, ?)",
        [
          roadmapId,
          step.id,
          step.label,
          step.description,
          step.estimatedTime || null,
          step.courseId || null,
        ]
      );
      const roadmapStepId = stepResult.insertId;

      if (Array.isArray(step.details)) {
        for (const sub of step.details) {
          await db.query(
            "INSERT INTO step_details (roadmap_step_id, sub_id, label, description) VALUES (?, ?, ?, ?)",
            [roadmapStepId, sub.id, sub.label, sub.description]
          );
        }
      }
    }

    return res.json({
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




export const getAllRoadmaps = async (req, res) => {
  try {
    const [roadmaps] = await db.query(
      `SELECT r.id AS roadmap_id, r.user_id, u.name AS user_name, r.career, r.created_at
       FROM roadmaps r
       JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );

    res.json(roadmaps);
  } catch (err) {
    console.error("❌ Error fetching all roadmaps:", err);
    res.status(500).json({ error: "Failed to fetch all roadmaps." });
  }
};

// ✅ Get the latest roadmap for a specific user
export const getSavedRoadmap = async (req, res) => {
  const userId = req.params.userId;
  console.log("🔍 Fetching saved roadmap for user:", userId);

  try {
    const [[roadmap]] = await db.query(
      "SELECT id, career, created_at FROM roadmaps WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (!roadmap) {
      // ✅ Return empty format instead of 404
      return res.status(200).json({
        career: null,
        roadmap: [],
        courses: [],
        institutions: [],
      });
    }

    const roadmapId = roadmap.id;

    const [steps] = await db.query(
      "SELECT id, step_id, label, description, estimated_time, course_id FROM roadmap_steps WHERE roadmap_id = ?",
      [roadmapId]
    );

    const roadmapWithDetails = await Promise.all(
      steps.map(async (step) => {
        const [details] = await db.query(
          "SELECT sub_id, label, description FROM step_details WHERE roadmap_step_id = ?",
          [step.id]
        );

        return {
          id: step.step_id,
          label: step.label,
          description: step.description,
          estimatedTime: step.estimated_time,
          courseId: step.course_id,
          details,
        };
      })
    );

    const courseIds = steps.map((s) => s.course_id).filter(Boolean);
    let courses = [];
    let institutions = [];

    if (courseIds.length > 0) {
      [courses] = await db.query("SELECT * FROM courses WHERE id IN (?)", [courseIds]);

      const institutionIds = [...new Set(courses.map((c) => c.institution_id))];
      if (institutionIds.length > 0) {
        [institutions] = await db.query("SELECT * FROM institutions WHERE id IN (?)", [institutionIds]);
      }
    }

    res.json({
      career: roadmap.career,
      roadmap: roadmapWithDetails,
      courses,
      institutions,
    });
  } catch (err) {
    console.error("❌ Error fetching saved roadmap:", err);
    res.status(500).json({ error: "Failed to fetch saved roadmap." });
  }
};
