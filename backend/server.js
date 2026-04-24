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
       // "words",
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
        "main idea and supporting ideas", 
        "supporting ideas"
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
    
    // --- 3️ Define sample suggestions for each missing component
    const suggestionsByComponent = [
      {key: "format", // optional unique identifier
      heading: "Suggest format",
      description: "Indicate how you want the response structured, e.g., bullet points, numbered lists, paragraphs, short sentences, tables, or charts.",
      type: "single", // or "multi" depending on your UI
      options: componentKeywords["format"].map(keyword => ({
        label: keyword,
        value: `Format the response as ${keyword}.` // full phrase including the keyword
        }))
      },
      {
        key:"length",
        heading: "Length",
        description: "Desired response length?",
        type: "single",
        options: componentKeywords["length"].map(keyword => ({
          label: keyword,
          value: `Write the response ${keyword}.` // full phrase including the keyword
        }))
      },
    
      {
        key: "scopeSumm",
        heading: "Scope of summary",
        description: "Clarify what sections or main ideas should be included in the summary.",
        type: "single",
        options: componentKeywords["scopeSumm"].map(keyword => ({
          label: keyword,
          value: `Focus on ${keyword}.` // full phrase including the keyword
        }))
      }, 
      {
        key: "tone",
        heading: "Include tone",
        description: "Specify the style or tone of the response: professional, casual, neutral, academic, formal, or informal.",
        type: "single",
        options: componentKeywords["tone"].map(keyword => ({
          label: keyword,
          value: `Use a ${keyword} tone in the response.` // full phrase including the keyword
        }))
      },
      {
        key: "scopeGen",
        heading: "Include scope",
        description: "Define which areas or topics should be covered in the generated content.",
        type: "single",
        options: componentKeywords["scopeGen"].map(keyword => ({
          label: keyword,
          value: `Cover the ${keyword} in the response.` // full phrase including the keyword
        }))
      },
      {
        key: "structureGen",
        heading: "Clarify structure",
        description: "Provide guidance on how the generated content should be organized, e.g., problem→solution, cause→effect, chronological, or compare→contrast.",
        type: "single",
        options: componentKeywords["structureGen"].map(keyword => ({
          label: keyword,
          value: `Organize the response using ${keyword} structure.` // full phrase including the keyword
        }))
      },
      {
        key: "audience",
        heading: "Include audience",
        description: "Specify who the response is intended for, such as employees, students, customers, business partners, or beginners.",
        type: "single",
        options: componentKeywords["audience"].map(keyword => ({
          label: keyword,
          value: `Write the response for ${keyword}.` // full phrase including the keyword
        }))
      }, 
      {
        key: "objectiveGen",
        heading: "Clarify objective",
        description: "State the goal of the generated content: to persuade, inform, educate, communicate, or analyze.",
        type: "single",
        options: componentKeywords["objectiveGen"].map(keyword => ({
          label: keyword,
          value: `The objective of the response is to ${keyword}.`
        }))
      },
      {
        key: "criteriaEval",
        heading: "Include evaluation criteria",
        description: "Specify the factors to assess, such as strengths/weaknesses, pros/cons, opportunities/risks, or advantages/disadvantages.",
        type: "single",
        options: componentKeywords["criteriaEval"].map(keyword => ({
          label: keyword,
          value: `Evaluate the response based on ${keyword}.`
        }))
      },
      {
        key: "scaleEval",
        heading: "Include evaluation scale",
        description: "Define the scoring method for evaluation, e.g., numerical scale (1–5, 1–10), poor/fair/good/excellent, pass/fail, or percentages.",
        type: "single",
        options: componentKeywords["scaleEval"].map(keyword => ({
          label: keyword,
          value: `Use ${keyword} scale for evaluation.`
        }))
      },
      {
        key: "scopeEval",
        heading: "Include scope",
        description: "Clarify which sections of the input should be analyzed: overall content, detailed sections, or specific parts.",
        type: "single",
        options: componentKeywords["scopeEval"].map(keyword => ({
          label: keyword,
          value: `Focus on ${keyword} when analyzing the response.`
        }))
      },
      {
        key: "depthEval",
        heading: "Specify depth",
        description: "Indicate how thorough the evaluation should be: brief, moderate, or in-depth.",
        type: "single",
        options: componentKeywords["depthEval"].map(keyword => ({
          label: keyword,
          value: `Provide a ${keyword} analysis of the content.`
        }))
      },
    
      {
        key: "scopeExpl",
        heading: "Include scope",
        description: "Clarify which sections or concepts need to be explained: main points, supporting ideas, or both.",
        type: "single",
        options: componentKeywords["scopeExpl"].map(keyword => ({
          label: keyword,
          value: `Explain the ${keyword} in the response.`
        }))
      },
      {
        key: "depthExpl",
        heading: "Specify depth",
        description: "Indicate whether the explanation should be brief, moderate, or detailed.",
        type: "single",
        options: componentKeywords["depthExpl"].map(keyword => ({
          label: keyword,
          value: `Provide a ${keyword} explanation.`
        }))
      },
      {
        key: "clarityExpl",
        heading: "Add clarity",
        description: "Improve understanding by defining key terms, using examples, visual descriptions, or simplifying complex language.",
        type: "multi",
        options: componentKeywords["clarityExpl"].map(keyword => ({
          label: keyword,
          value: `Enhance clarity by ${keyword}.`
        }))
      },
      {
        key: "scopeComp",
        heading: "Include scope",
        description: "Specify which items or concepts should be compared or contrasted: general comparison, in-depth comparison, similarities, differences.",
        type: "single",
        options: componentKeywords["scopeComp"].map(keyword => ({
          label: keyword,
          value: `Compare based on ${keyword}.`
        }))
      },
      {
        key: "criteriaComp",
        heading: "Include comparison criteria",
        description: "Identify the aspects to compare: pros/cons, short/long-term impacts, similarities/differences, risks, or overall effect.",
        type: "multi",
        options: componentKeywords["criteriaComp"].map(keyword => ({
          label: keyword,
          value: `Use ${keyword} as comparison criteria.`
        }))
      },
      {
        key: "scopeStruc",
        heading: "Include scope",
        description: "Clarify what content should be organized: all content, key points only, key points with supporting details, or highlights.",
        type: "single",
        options: componentKeywords["scopeStruc"].map(keyword => ({
          label: keyword,
          value: `Organize content to ${keyword}.`
        }))
      },
      {
        key: "arrangementStruc",
        heading: "Clarify arrangement",
        description: "Provide the order or structure of content: alphabetical, chronological, by category, by priority, by similarities/differences, or step-by-step.",
        type: "single",
        options: componentKeywords["arrangementStruc"].map(keyword => ({
          label: keyword,
          value: `Arrange content in ${keyword}.`
        }))
      },
      {
        key: "scopeRef",
        heading: "Include scope",
        description: "Specify which sections need refinement, rewording, or improvement.",
        type: "single",
        options: componentKeywords["scopeRef"].map(keyword => ({
          label: keyword,
          value: `Refine the content: ${keyword}.`
        }))
      },
      {
        key: "changeRef",
        heading: "Specify change type",
        description: "Define what kind of refinements are needed: improve clarity, add or remove details, enhance flow, simplify language, or restructure sentences.",
        type: "multi",
        options: componentKeywords["changeRef"].map(keyword => ({
          label: keyword,
          value: `Apply changes to ${keyword}.`
        }))
      },
      {
        key: "inclusionInstr",
        heading: "Add inclusion/exclusion",
        description: "Specify what elements should be included or excluded, such as examples, key terms, or supporting points.",
        type: "multi",
        options: componentKeywords["inclusionInstr"].map(keyword => ({
          label: keyword,
          value: `Ensure to ${keyword}.`
        }))
      },
      {
        key: "roleInstr",
        heading: "Specify role",
        description: "Indicate the perspective or role to adopt: employee, customer, student, professional, consultant, researcher, manager, etc.",
        type: "single",
        options: componentKeywords["roleInstr"].map(keyword => ({
          label: keyword,
          value: `Write from the perspective of a ${keyword}.`
        }))
      },
      {
        key: "citationFormat",
        heading: "Specify citation format",
        description: "Indicate the reference style (MLA, APA, Chicago) and what you are citing (book, journal, article, research paper).",
        type: "single",
        options: componentKeywords["citationFormat"].map(keyword => ({
          label: keyword,
          value: `Use ${keyword.toUpperCase()} citation format.`
        }))
      },
      {
        key: "sourceType",
        heading: "Specify source type",
        description: "Clarify the type of sources required, such as primary articles, secondary articles, books, journals, research reports, datasets, interviews, or news articles.",
        type: "multi",
        options: componentKeywords["sourceType"].map(keyword => ({
          label: keyword,
          value: `Include sources such as ${keyword}.`
        }))
      },
      {
        key: "sourceRange",
        heading: "Specify source range",
        description: "Define the publication timeframe for the sources, e.g., books within the last 5 years or journals within the last 10 years.",
        type: "single",
        options: componentKeywords["sourceRange"].map(keyword => ({
          label: keyword,
          value: `Limit sources to ${keyword}.`
        }))
      },
    ];
    
    
   
    

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
  const suggestionData = suggestionsByComponent.find(s => s.key === component);

  
    if (!suggestionData) {
      return {
        component,
        heading: "Improve this aspect",
        description: "Consider refining this part of your prompt.",
        type: "single",
        options: []

      };
    }
  
    const { heading, description, type, options } = suggestionData;
    return {
      component,
      heading,
      description,
      type,       // "single" or "multi"
      options     // array of { label, value } objects

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