const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// --- 1️ Define keyword arrays for prompt types
// instruction categories → map to words that indicate that instruction 
const promptTypes = {
    "summary": ["summarize", "condense", "abstract", "outline"],
    "generate": ["write", "create", "generate", "compose", "draft", "develop"],
    "analyzing": ["analyze", "assess", "evaluate", "review", "critique"],
    "explaining": ["explain", "describe", "define", "illustrate", "simplify"],
    "comparing": ["compare", "contrast", "differentiate", "distinguish", "identify similarities and differences"],
    "structuring": ["list", "format as a table", "outline", "structure", "enumerate"],
    "refining": ["rephrase", "rewrite", "reword", "edit", "refine", "expand"],
    "instructions": ["act as", "constraint: ", "avoid", "include", "exclude", "focus on", "neglect"],
    "methodology": ["step-by-step", "chain of thought"],
    "research":["cite", "prove", "find","quantify","verify", "validate", "source", "reference", "investigate", "explore"]
};
    
    
    // --- 2️ Define rules for each type – include local and global key aspect/ components
    const rulesByType = {
        "default": ["format", "length", "tone"],
        "summary": ["format", "length", "scopeSumm", "tone"],
        "generate": ["format", "length", "scopeGen", "tone", "structureGen", "audience", "objectiveGen"],
        "analyzing": ["criteriaEval", "scaleEval", "scopeEval", "depthEval", "format"],
        "explaining": ["format", "length", "scopeExpl", "tone", "depthExpl", "audience", "clarityExpl"],
        "comparing": ["format", "scopeComp", "tone", "criteriaComp"],
        "structuring": ["format", "scopeStruc", "arrangementStruc"],
        "refining": ["format", "length", "scopeRef", "tone", "changeRef"],
        "instructions": ["format", "length", "inclusionInstr", "tone", "roleInstr"],
        "methodology": ["format", "length", "tone", "audience"],
        "research": ["citationFormat", "sourceType", "sourceRange"]
      };
    
    
    // --- 3️ Define sample suggestions for each missing component
    const suggestionsByComponent = {
    "format": [
    "Suggest format",
    "Indicate how you want the response structured, e.g., bullet points, numbered lists, paragraphs, short sentences, tables, or charts."
    ],
    "length": [
    "Add length requirement",
    "Specify the desired length of the response, such as in words, sentences, paragraphs, bullet points, or key points."
    ],
    "scopeSumm": [
    "Include scope",
    "Clarify what sections or main ideas should be included in the summary: main points, supporting ideas, or both."
    ],
    "tone": [
    "Include tone",
    "Specify the style or tone of the response: professional, casual, neutral, academic, formal, or informal."
    ],
    "scopeGen": [
    "Include scope",
    "Define which areas or topics should be covered in the generated content."
    ],
    "structureGen": [
    "Clarify structure",
    "Provide guidance on how the generated content should be organized, e.g., problem→solution, cause→effect, chronological, or compare→contrast."
    ],
    "audience": [
    "Include audience",
    "Specify who the response is intended for, such as employees, students, customers, business partners, or beginners."
    ],
    "objectiveGen": [
    "Clarify objective",
    "State the goal of the generated content: to persuade, inform, educate, communicate, or analyze."
    ],
    "criteriaEval": [
    "Include evaluation criteria",
    "Specify the factors to assess, such as strengths/weaknesses, pros/cons, opportunities/risks, or advantages/disadvantages."
    ],
    "scaleEval": [
    "Include evaluation scale",
    "Define the scoring method for evaluation, e.g., numerical scale (1–5, 1–10), poor/fair/good/excellent, pass/fail, or percentages."
    ],
    "scopeEval": [
    "Include scope",
    "Clarify which sections of the input should be analyzed: overall content, detailed sections, or specific parts."
    ],
    "depthEval": [
    "Specify depth",
    "Indicate how thorough the evaluation should be: brief, moderate, or in-depth."
    ],
    "scopeExpl": [
    "Include scope",
    "Clarify which sections or concepts need to be explained: main points, supporting ideas, or both."
    ],
    "depthExpl": [
    "Specify depth",
    "Indicate whether the explanation should be brief, moderate, or detailed."
    ],
    "clarityExpl": [
    "Add clarity", "in a detailed manner",
    "Improve understanding by defining key terms, using examples, visual descriptions, or simplifying complex language."
    ],
    "scopeComp": [
    "Include scope",
    "Specify which items or concepts should be compared or contrasted: general comparaison, in-depth comparaison, similarities, differences."
    ],
    "criteriaComp": [
    "Include comparison criteria",
    "Identify the aspects to compare: pros/cons, short/long-term impacts, similarities/differences, risks, or overall effect."
    ],
    "scopeStruc": [
    "Include scope",
    "Clarify what content should be organized: all content, key points only, key points with supporting details, or highlights."
    ],
    "arrangementStruc": [
    "Clarify arrangement",
    "Provide the order or structure of content: alphabetical, chronological, by category, by priority, by similarities/differences, or step-by-step."
    ],
    "scopeRef": [
    "Include scope",
    "Specify which sections need refinement, rewording, or improvement."
    ],
    "changeRef": [
    "Specify change type",
    "Define what kind of refinements are needed: improve clarity, add or remove details, enhance flow, simplify language, or restructure sentences."
    ],
    "inclusionInstr": [
    "Add inclusion/exclusion",
    "Specify what elements should be included or excluded, such as examples, key terms, or supporting points."
    ],
    "roleInstr": [
    "Specify role",
    "Indicate the perspective or role to adopt: employee, customer, student, professional, consultant, researcher, manager, etc."
    ], 
    "citationFormat": [
        "Specify citation format",
        "Indicate the reference style (MLA, APA, Chicago) and what you are citing (book, journal, article, research paper)."
      ],
      "sourceType": [
        "Specify source type",
        "Clarify the type of sources required, such as primary articles, secondary articles, books, journals, research reports, datasets, interviews, or news articles."
      ],
      "sourceRange": [
        "Specify source range",
        "Define the publication timeframe for the sources, e.g., books within the last 5 years or journals within the last 10 years."
      ]
    };
    
    
    // --- 4️ Define keyword indicators for each global + local (scopeSummary→ keyaspect Category) component (highlighted in yellow) 
    const componentKeywords = {
        "format": [
            "list", "paragraph", "number",
          "bullet points",
          "numbered list",
          "paragraphs",
          "short sentences",
          "long sentences",
          "table",
          "chart", "essay", "outline",  "executive summary",
        ],
      
        "length": [
          "words",
          "in * sentences",
          "in * bullet points",
          "in * paragraphs",
          "in * short sentences",
          "in * key points",
          "limit to * words",
          "limit to * sentences",
          "limit to * key points",
          "limit to * paragraphs",
          "limit to * bullet points",
          "under * words",
          "under * paragraphs",
          "under * sentences",
          "shorten",
          "remove sections",
          "in a few paragraphs",
          "sentence count",
          "bullet point",
          "numbered list",
          "keep the same length",
          "maintain length",
          "leave length unchanged",
          "lengthen by adding details",
          "shorten by removing details",
          "3 main points",
          "3 key points",
          "in a few sentences",
          "in one sentence",
          "in one paragraph"
        ],
      
        "scopeSumm": [
          "main idea",
          "main idea and supporting ideas"
        ],
      
        "tone": [
          "professional",
          "casual",
          "neutral",
          "no change in tone",
          "academic",
          "educational",
          "formal",
          "informal"
        ],

        "scopeGen": [
          "main idea",
          "main topic",
          "main features",
          "main benefits",
          "supporting arguments"
        ],
      
        "structureGen": [
          "problem", "solution",
          "cause", "effect",
          "compare", "contrast",
          "chronological",
          "question", "answer"
        ],
      
        "audience": [
          "employees",
          "students",
          "customers",
          "business partners",
          "hr managers",
          "recruiters",
          "research department",
          "tech department",
          "for a beginner"
        ],
      
        "objectiveGen": [
          "persuade",
          "inform",
          "educate",
          "communicate",
          "analyze"
        ],
      
        "criteriaEval": [
          "swot format",
          "advantages", "disadvantages", "advantages and disadvantages",
          "pros",
          "cons",
          "risk level",
          "opportunities", "risks"
        ],
      
        "scaleEval": [
          "numerical",
          "poor", "fair", "good", "excellent",
          "percentage score",
          "pass", "fail",
          "stars",
          "out of"
        ],
      
        "scopeEval": [
          "overall assessment",
          "detailed analysis * section",
          "focus on"
        ],
      
        "depthEval": [
          "deep analysis",
          "surface level analysis",
          "moderate analysis"
        ],
      
        "scopeExpl": [
          "main point",
          "main point and supporting points", "supporting points",
          "why it matters",
          "how to use it",
          "cause and effect"
        ],
      
        "depthExpl": [
          "deep analysis",
          "surface level analysis",
          "moderate analysis"
        ],
      
        "clarityExpl": [
          "define key terms",
          "real-world examples",
          "visual descriptions",
          "simple terms"
        ],
      
        "scopeComp": [
          "pros and cons",
          "general",
          "in depth",
          "similarities",
          "differences",
          "detailed section by section comparison"
        ],
      
        "criteriaComp": [
          "good", "bad",
          "short term", "long term", "long", "short",
          "risks",
          "pros",
          "cons"
        ],
      
        "arrangementStruc": [
          "priority order",
          "chronological order",
          "alphabetical order",
          "by category",
          "by similarities",
          "by differences",
          "step by step sequence"
        ],
      
        "scopeStruc": [
          "include all content",
          "key points only",
          "key points and supporting details",
          "highlights key points",
          "exclude content",
          "include content"
        ],
      
        "changeRef": [
          "improve clarity",
          "add details",
          "remove details",
          "add supporting points",
          "enhance flow",
          "improve readability",
          "simplify language",
          "add examples",
          "change sentence structure"
        ],
      
        "scopeRef": [
          "include all content",
          "key points",
          "key points and supporting details",
          "highlights key points",
          "exclude content",
          "include content"
        ],
      
        "inclusionInstr": [
          "include examples",
          "include key terms",
          "exclude examples",
          "exclude key terms",
          "include supporting points",
          "exclude supporting points"
        ],
      
        "roleInstr": [
          "act as", "point of view", "pretend", "approach", "employee",
          "customer",
          "student",
          "rofessional",
          "consultant",
          "banking analyst",
          "researcher",
          "manager"
        ], 
        
        "citationFormat": [
            "mla",
            "apa",
            "chicago",
            "reference type",
            "citation type",
            "book citation",
            "journal citation",
            "article citation",
            "research paper citation",
            "cite this book in",
            "cite this journal in",
            "cite this research paper in"
          ],
        
          "sourceType": [
            "primary article",
            "secondary article",
            "primary and secondary articles",
            "book",
            "journal",
            "articles",
            "peer-reviewed journal articles",
            "research reports",
            "datasets",
            "interviews",
            "news articles",
            "tertiary sources",
            "academic sources",
            "popular sources",
            "grey sources",
            "yearly statements",
            "yearly reports",
            "annual reports",
            "monthly reports"
          ],
        
          "sourceRange": [
            "books within the last",
            "journals within the last",
            "published in the last",
            "articles from the last", "year"
          ]
        
      };
    

// --- 5️⃣ Endpoint to evaluate prompt
app.post("/evaluate", (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const lowerPrompt = prompt.toLowerCase();

  // --- 5a: Detect prompt type
  let detectedType = "default";
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
const suggestions = missingComponents.map(component => {
    const suggestionData = suggestionsByComponent[component];
  
    if (!suggestionData) {
      return {
        component,
        heading: "Improve this aspect",
        description: "Consider refining this part of your prompt."
      };
    }
  
    const [heading, description] = suggestionData;
    return {
      component,
      heading,
      description
    };
  });

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