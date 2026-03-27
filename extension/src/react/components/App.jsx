import { useState } from "react";
import leafLogo from "../../assets/icons8-leaf-96.png";

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const applySuggestion = (optionValue) => {
    // Append the selected suggestion to the current prompt
    const newPrompt = prompt.trim() + " " + optionValue;
    setPrompt(newPrompt);
    setHasEvaluated(false);
    getSuggestion(newPrompt); // pass the new prompt
  
  };
  const getSuggestion = async (currentPrompt) => {
    const promptToUse = String(currentPrompt ?? prompt); // use passed prompt if available

    if (!promptToUse.trim()) return;
  
  
  
    try {
      const response = await fetch("http://localhost:3001/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse })
      });
  
      const data = await response.json();
      const formattedSuggestions = data.suggestions.map(s => ({
        component: s.component,
        heading: s.heading,
        description: s.description,
        options: s.options || []
      }));
      setSuggestions(formattedSuggestions);
      setHasEvaluated(true);
      setShowAllSuggestions(false);
 
  
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const styles = {
    container: {
      maxWidth: "1200px", // wider
      margin: "40px auto",
      padding: "28px 40px", // less vertical padding
      fontFamily: "system-ui, sans-serif",
      background: "#f4f9f6",
      borderRadius: "18px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.04)"
    },
    header: {
      marginBottom: "18px"
    },
    title: {
      fontSize: "30px",
      fontWeight: "700",
      color: "#1b4332",
      marginBottom: "4px"
    },
    tagline: {
      fontSize: "14px",
      color: "#40916c",
      fontWeight: "500"
    },
    textarea: {
      width: "160px",
      minHeight: "120px", // shorter vertically
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #cce3d6",
      fontSize: "14px",
      resize: "vertical",
      marginBottom: "16px",
      background: "white"
    },
    button: {
      background: "#2d6a4f",
      color: "white",
      padding: "10px 18px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "600",
      fontSize: "14px"
    },
    suggestionsContainer: {
      marginTop: "26px"
    },
    sectionTitle: {
      fontSize: "18px",
      fontWeight: "600",
      marginBottom: "12px",
      color: "#1b4332"
    },
    card: {
      background: "white",
      padding: "16px",
      borderRadius: "12px",
      marginBottom: "14px",
      border: "1px solid #e9f5ee"
    },
    cardTitle: {
      fontSize: "15px",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#2d6a4f"
    },
    improvementBox: {
      marginTop: "10px",
      padding: "10px",
      background: "#edf7f1",
      borderRadius: "8px",
      fontSize: "13px",
      color: "#344e41"
    },
    headerRow: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        marginBottom: "4px"
      },
      logo: {
        width: "36px",   // adjust size if needed
        height: "36px",
        objectFit: "contain"
      },
      successContainer: {
        marginTop: "26px"
      },
      successCard: {
        background: "#e6f4ea",
        padding: "18px",
        borderRadius: "14px",
        border: "1px solid #b7e4c7",
        boxShadow: "0 6px 16px rgba(0,0,0,0.04)"
      },
      successTitle: {
        fontSize: "16px",
        fontWeight: "700",
        color: "#1b4332",
        marginBottom: "6px"
      },
      successMessage: {
        fontSize: "14px",
        color: "#2d6a4f",
        lineHeight: "1.5"
      },
      // for question mark hover
      tooltipIcon: {
        marginLeft: "8px",
        cursor: "pointer",
        background: "#d8f3dc",
        color: "#1b4332",
        borderRadius: "50%",
        width: "18px",
        height: "18px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12px",
        fontWeight: "700"
      },
      tooltipBox: {
        position: "absolute",
        background: "#1b4332",
        color: "white",
        padding: "8px 10px",
        borderRadius: "6px",
        fontSize: "12px",
        marginTop: "6px",
        maxWidth: "220px",
        zIndex: 999
      },
      cardHeader: {
        display: "flex",
        alignItems: "center",
        position: "relative"
      }, 
      // dropdown
      toggleButton: {
        background: "transparent",
        color: "#40916c",
        border: "none",
        fontSize: "12px",
        cursor: "pointer",
        fontWeight: "500",
        padding: "4px 6px"
      }, 
      sectionHeaderRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px"
      }
  };

  return (
    <main style={styles.container}>
      <div style={styles.header}>
      <div style={styles.headerRow}>
        <img src={leafLogo} alt="Eco Prompter Logo" style={styles.logo} />
        <h1 style={styles.title}>Eco Prompter</h1>
        </div>
        <div style={styles.tagline}>
          Better prompts. Less waste.
        </div>
      </div>

      <textarea
        style={styles.textarea}
        placeholder="Paste or write your prompt here..."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setHasEvaluated(false);
        }}
      />

      <button style={styles.button} onClick={() => getSuggestion(prompt)}>
        Optimize Prompt
      </button>

      {suggestions.length > 0 ? (
        <div style={styles.suggestionsContainer}>
          <div style={styles.sectionHeaderRow}>
          <h2 style={styles.sectionTitle}>Suggestions</h2>
          {!showAllSuggestions && suggestions.length > 3 && (
            <button
              //style={{ ...styles.button, marginTop: "10px" }}
              style={styles.toggleButton}
              onClick={() => setShowAllSuggestions(true)}
            >
            ▼
            </button>
          )}

          {showAllSuggestions && (
            <button
              //style={{ ...styles.button, marginTop: "10px" }}
              style={styles.toggleButton}
              onClick={() => setShowAllSuggestions(false)}
            >
              ▲
            </button>
          )}
           </div>
          {(showAllSuggestions ? suggestions : suggestions.slice(0, 3)).map((s, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardHeader}>
              <div style={styles.cardTitle}>{s.heading}</div>

              <div
                style={styles.tooltipWrapper}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={styles.tooltipIcon}>?</div>

                {hoveredIndex === index && (
                  <div style={styles.tooltipBox}>
                    {s.description}
                  </div>
                )}
              </div>
            </div>
            {/* Render suggestion options if available */}
            {s.options && s.options.length > 0 && (
                  <div style={styles.improvementBox}>
                    {s.options.slice(0, 7).map((opt, i) => (
                      <button
                        key={i}
                        style={{ ...styles.button, fontSize: "12px", padding: "4px 8px", margin: "3px" }}
                        onClick={() => applySuggestion(opt.value)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  )}
            </div>
          ))}
        </div>
      ) : hasEvaluated && (
        <div style={styles.successContainer}>
          <div style={styles.successCard}>
            <div style={styles.successTitle}>Excellent Prompt</div>
            <div style={styles.successMessage}>
              Your prompt already includes the essential components for high-quality output.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

