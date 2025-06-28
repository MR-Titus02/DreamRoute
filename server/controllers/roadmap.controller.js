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
    
    Generate a detailed career roadmap with a **minimum of 5 sections**, and **at least 3 to 5 steps per section** (totaling **15 to 25 steps** minimum). Make each step granular and small enough to be completed in 2–5 days.
    Do NOT skip small steps. Break every concept into multiple smaller steps if needed. Think like roadmap.sh.

    
    For each section, include:
    - A "section" title
    - A brief "description" of the section
    
    For each step inside sections, include:
    - A unique "id"
    - A "label" summarizing the step
    - A detailed "description"
    - An "estimatedTime" (e.g. "3 days", "1 week")
    - A list of relevant "skills" this step teaches
    - A list of "resources" (names and URLs) for learning
    - If applicable, include "courseId" referencing a course from the provided list
    
    Return a JSON response in this format:
    
    {
      "career": "Suggested Career Title",
      "roadmap": [
        {
          "id": "1",
          "section": "Section Title",
          "description": "Brief description of the section",
          "steps": [
            {
              "id": "1.1",
              "label": "Step Title",
              "description": "What to learn in this step",
              "estimatedTime": "2 weeks",
              "skills": ["Skill1", "Skill2"],
              "resources": [
                { "name": "Resource Name", "url": "https://resource.url" }
              ],
              "courseId": 4
            },
            ...
          ]
        },
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
    - Ensure the roadmap contains at least 15 steps total.
    - Each courseId used in roadmap must match an object from the course list.
    - Match each course with its correct institution (based on institution_id) in the 'courses' section.
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
    console.log("AI Response:", result);
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
