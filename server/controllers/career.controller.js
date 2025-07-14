import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
import dagre from "dagre";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Layout helper
function applyDagreLayout(nodes, edges, direction = "TB") {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 100, ranksep: 120 });

  nodes.forEach((node) => g.setNode(node.id, { width: 180, height: 100 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));

  dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    return { ...node, position: { x, y } };
  });
}

export const generateCareer = async (req, res) => {
  const { userId } = req.body;
  console.log("Generating career roadmap for userId:", userId);

  if (!userId) {
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    const [[profile]] = await db.query("SELECT * FROM career_profiles WHERE user_id = ?", [userId]);
    const [[career]] = await db.query("SELECT * FROM roadmaps WHERE user_id = ?", [userId]);

    if (!profile) return res.status(404).json({ error: "Career profile not found" });
    if (!career) return res.status(404).json({ error: "Career roadmap info not found" });

    const prompt = `
You are a career roadmap generator for students in Sri Lanka.

Your task is to generate **multiple realistic and diverse career paths** from the user's current education level to their dream career.

Each path should represent a **different route**, such as:
- Traditional university education
- Vocational/technical training
- Online certifications
- Self-learning with internships
- Fast-track bootcamps

Your output should be a **React Flow-compatible JSON array of nodes**. Each node must include:
- id: unique string
- label: short title of the step
- description: 1–2 lines explaining the step
- connections: an array of IDs this node connects to (can be multiple for branching)

Guidelines:
- The roadmap must have **branching paths**.
- Steps must connect **from the current level** to the **target career**.
- You may reuse shared steps across branches (e.g., “Learn JavaScript”).
- Start from current education level and include intermediate steps.
- Use IDs like "1", "2", "3a", "3b" etc. to support merging and diverging paths.
- You should create the roadmap based on the following user profile:

User Profile:
- Full Name: ${profile.full_name}
- Target Career: ${career.career}
- Interests: ${profile.interest_areas}
- Education Level: ${profile.education_level}
- Study Language: ${profile.study_language}
- Experience: ${profile.experience}
- Certifications: ${profile.certifications}
- Age: ${profile.age}

Return ONLY a JSON array of roadmap steps.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful roadmap planner that creates visual flows for students." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content.trim();

    // Clean code block wrappers if present
    if (content.startsWith("```")) {
      content = content.replace(/^```json\n?|^```\n?/, "").replace(/```$/, "").trim();
    }

    let steps;
    try {
      steps = JSON.parse(content);
    } catch (jsonErr) {
      console.error("Failed to parse AI response as JSON:", jsonErr.message);
      return res.status(200).json({ type: "text", content }); // fallback for debugging
    }

    // Convert to React Flow nodes and edges
    const nodes = steps.map((step) => ({
      id: step.id,
      type: "statusNode",
      data: {
        label: step.label,
        description: step.description,
        status: "not_started",
      },
    }));

    const edges = steps.flatMap((step) =>
      step.connections.map((targetId) => ({
        id: `e${step.id}-${targetId}`,
        source: step.id,
        target: targetId,
        type: "smoothstep",
      }))
    );

    const positionedNodes = applyDagreLayout(nodes, edges, "TB");

    const roadmapJson = {
      nodes: positionedNodes,
      edges,
      career: career.career,
    };

    // Save to DB (upsert)
    const [existing] = await db.query("SELECT * FROM career_roadmaps WHERE user_id = ?", [userId]);

    if (existing.length > 0) {
      await db.query(
        "UPDATE career_roadmaps SET content = ?, career = ?, updated_at = NOW() WHERE user_id = ?",
        [JSON.stringify(roadmapJson), career.career, userId]
      );
      console.log("Roadmap updated in DB.");
    } else {
      await db.query(
        "INSERT INTO career_roadmaps (user_id, career, content) VALUES (?, ?, ?)",
        [userId, career.career, JSON.stringify(roadmapJson)]
      );
      console.log("New roadmap inserted in DB.");
    }

    return res.status(200).json({
      type: "reactflow",
      content: roadmapJson,
    });
  } catch (err) {
    console.error("Error generating and saving roadmap:", err);
    return res.status(500).json({ error: "Failed to generate and save roadmap." });
  }
};


export const getCareerRoadmap = async (req, res) => {
  const { userId } = req.params;

  try {
    const [[record]] = await db.query("SELECT content FROM career_roadmaps WHERE user_id = ?", [userId]);

    if (!record) {
      return res.status(404).json({ error: "No saved roadmap found." });
    }

    return res.status(200).json({
      type: "reactflow",
      content: record.content,
    });
  } catch (err) {
    console.error("Error fetching roadmap:", err);
    return res.status(500).json({ error: "Error fetching roadmap." });
  }
};
