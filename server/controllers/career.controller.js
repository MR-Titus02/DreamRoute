import OpenAI from "openai";
import db from "../config/db.js";
import dotenv from "dotenv";
import dagre from "dagre";
dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Layout helper using Dagre
function applyDagreLayout(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'TB',      
    nodesep: 100,        
    ranksep: 120,       
  });

  nodes.forEach((node) => {
    console.log(`Applying dagre layout node: ${node.id}`);
    g.setNode(node.id, { width: 180, height: 100 });
  });
  edges.forEach((edge) => {
    console.log(`Applying dagre layout edge: ${edge.source} -> ${edge.target}`);
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  return nodes.map((node) => {
    const { x, y } = g.node(node.id);
    console.log(`Position for node ${node.id}: x=${x}, y=${y}`);
    return {
      ...node,
      position: { x, y },
    };
  });
}

export const generateCareer = async (req, res) => {
  const { userId } = req.body;
  console.log("Received request to generate career roadmap for userId:", userId);

  if (!userId) {
    console.error("No userId provided in request body.");
    return res.status(400).json({ error: "Missing userId in request body" });
  }

  try {
    const [[profile]] = await db.query("SELECT * FROM career_profiles WHERE user_id = ?", [userId]);
    const [[career]] = await db.query("SELECT * FROM roadmaps WHERE user_id = ?", [userId]);

    if (!profile) {
      console.warn(`No career profile found for user_id: ${userId}`);
      return res.status(404).json({ error: "Career profile not found" });
    }
    if (!career) {
      console.warn(`No career roadmap info found for user_id: ${userId}`);
      return res.status(404).json({ error: "Career roadmap info not found" });
    }

    console.log("User Profile:", profile);
    console.log("Career target:", career.career);

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

Target Career is MUST
Return ONLY a JSON array of roadmap steps with this structure:

[
  {
    "id": "1",
    "label": "Complete O/Ls",
    "description": "Finish core subjects with focus on ICT",
    "connections": ["2a", "2b"]
  },
  {
    "id": "2a",
    "label": "Do A/Ls - Physical Science",
    "description": "Choose Maths and ICT",
    "connections": ["3"]
  },
  {
    "id": "2b",
    "label": "Start NVQ Level 4 in IT",
    "description": "Technical diploma with hands-on training",
    "connections": ["3"]
  },
  {
    "id": "3",
    "label": "Build Projects & Get Certifications",
    "description": "Earn certificates via platforms like Coursera or Google",
    "connections": ["4", "5"]
  },
  {
    "id": "4",
    "label": "Get Internship at a Startup",
    "description": "Apply for internships to gain experience",
    "connections": ["6"]
  },
  {
    "id": "5",
    "label": "Join Full-Stack Bootcamp",
    "description": "Learn MERN stack intensively",
    "connections": ["6"]
  },
  {
    "id": "6",
    "label": "Become Full Stack Developer",
    "description": "Start working or freelancing as a full stack dev",
    "connections": []
  }
]
`;

    console.log("Sending prompt to OpenAI...");
    const completion = await openai.chat.completions.create({
      // model: "gpt-3.5-turbo-0125",
      model: "gpt-4o",
      messages: [
        { role: "system", content: "You are a helpful roadmap planner that creates visual flows for students." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    let content = completion.choices[0].message.content.trim();
    console.log("Raw AI response content:", content);

    // Remove any code block wrappers if present
    if (content.startsWith("```")) {
      content = content.replace(/^```json\n?|^```\n?/, "").replace(/```$/, "").trim();
    }
    console.log("Cleaned AI response for JSON parsing:", content);

    let steps;
    try {
      steps = JSON.parse(content);
      console.log(`Parsed ${steps.length} roadmap steps from AI response.`);
      steps.forEach((step, i) =>
        console.log(`Step ${i + 1}: id=${step.id}, label=${step.label}, connections=${step.connections.join(",")}`)
      );
    } catch (jsonErr) {
      console.error("Failed to parse AI JSON response:", jsonErr.message);
      return res.status(200).json({ type: "text", content });
    }

    // Convert steps to React Flow nodes and edges
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

    console.log("Applying dagre layout...");
    const positionedNodes = applyDagreLayout(nodes, edges, "TB");

    console.log("Returning final roadmap with nodes and edges.");
    return res.status(200).json({
      type: "reactflow",
      content: {
        nodes: positionedNodes,
        edges,
      },
    });
  } catch (err) {
    console.error("Error generating roadmap:", err);
    return res.status(500).json({ error: "Failed to generate roadmap." });
  }
}; 