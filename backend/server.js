// const express = require("express");
// const cors = require("cors");

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.post("/test", (req, res) => {
//   console.log("Received from frontend:", req.body);

//   res.json({
//     status: "success",
//     message: "Backend received your request!",
//     receivedPrompt: req.body.prompt || null
//   });
// });

// app.listen(3001, () => {
//   console.log("Server running at http://localhost:3001");
// });

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- 1️⃣ Define keyword arrays for prompt types
const promptTypes = {
  "explanation": ["explain", "describe", "teach", "how", "what is"],
  "comparison": ["compare", "differences", "versus", "vs"],
  "idea_generation": ["suggest", "idea", "brainstorm", "concept"],
  "summary": ["summarize", "summary", "short version", "outline"]
};

// --- 2️⃣ Define rules for each type
const rulesByType = {
  "explanation": ["scope", "length", "examples"],
  "comparison": ["items", "criteria", "format"],
  "idea_generation": ["quantity", "constraints", "format"],
  "summary": ["length", "format", "clarity"]
};

// --- 3️⃣ Define keyword indicators for each component
const componentKeywords = {
  "scope": ["for beginners", "in detail", "for experts", "in 2026", "context", "boundaries"],
  "length": ["short", "long", "under 200 words", "brief", "in 3 sentences", "concise"],
  "examples": ["for example", "like", "e.g.", "example", "illustrate"],
  "items": ["and", ",", "list of", "items", "elements"],
  "criteria": ["criteria", "factors", "conditions", "requirements", "aspects"],
  "format": ["bullet points", "table", "list", "step by step", "diagram", "outline", "code snippet"],
  "quantity": ["3 ideas", "five examples", "several", "many", "a few", "multiple"],
  "constraints": ["only", "must", "cannot", "limited to", "restricted", "constraint"],
  "clarity": ["clearly", "simply", "easy to understand", "concise"]
};

// --- 4️⃣ Define sample suggestions for each missing component
const suggestionsByComponent = {
  "scope": "Add more context or boundaries for the prompt.",
  "length": "Specify a length limit or range for the response.",
  "examples": "Include examples to clarify what you expect.",
  "items": "List the items to be compared explicitly.",
  "criteria": "Specify the criteria for comparison.",
  "format": "Define the format of the response (bullet points, table, etc.).",
  "quantity": "Specify how many ideas or items you want.",
  "constraints": "Include any specific constraints for the output.",
  "clarity": "Reword to make the prompt clearer."
};

// --- 5️⃣ Endpoint to evaluate prompt
app.post("/evaluate", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const lowerPrompt = prompt.toLowerCase();

  // --- 5a: Detect prompt type
  let detectedType = "general";
  for (const [type, keywords] of Object.entries(promptTypes)) {
    if (keywords.some(k => lowerPrompt.includes(k))) {
      detectedType = type;
      break;
    }
  }

  // --- 5b: Check for missing components using keyword indicators
  const expectedComponents = rulesByType[detectedType] || [];
  const missingComponents = expectedComponents.filter(component => {
    const indicators = componentKeywords[component] || [];
    // If none of the keywords appear in the prompt, mark as missing
    return !indicators.some(kw => lowerPrompt.includes(kw));
  });

  // --- 5c: Generate suggestions
  const suggestions = missingComponents.map(component => ({
    component,
    suggestion: suggestionsByComponent[component] || "Consider improving this aspect."
  }));

  res.json({
    prompt,
    detectedType,
    missingComponents,
    suggestions
  });
});

// --- 6️⃣ Start server
app.listen(3001, () => {
  console.log("Rule-based backend running on http://localhost:3001");
});