import { useState, useEffect } from "react";
import leafLogo from "../../assets/icons8-leaf-96.png";
import { useRef } from "react";
import { FiCopy } from "react-icons/fi";

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const [lastAdded, setLastAdded] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const textareaRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const applySuggestion = (optionValue) => {
    // Append the selected suggestion to the current prompt
    // const newPrompt = prompt.trim() + " " + optionValue;
    // setPrompt(newPrompt);
    // setHasEvaluated(false);
    // getSuggestion(newPrompt); // pass the new prompt
    const newText = optionValue;
    const newPrompt = prompt.trim() + " " + newText;
  
    setPrompt(newPrompt);
    setLastAdded(newText);
    setHasEvaluated(false);
    getSuggestion(newPrompt);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
      }
    }, 0);
  
  };
  useEffect(() => {
    if (lastAdded) {
      const timer = setTimeout(() => {
        setLastAdded("");
      }, 1000); // 1 second highlight
  
      return () => clearTimeout(timer);
    }
  }, [lastAdded]);
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
      setIsReady(true);
 
  
    } catch (error) {
      console.error("Error connecting to backend:", error);
    }
  };

  const styles = {
    container: {
      //width: "100%",
      //minWidth: "600px",
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
      fontSize: "36px",
      fontWeight: "700",
      color: "#1b4332",
      marginBottom: "4px"
    },
    tagline: {
      fontSize: "20px",
      color: "#40916c",
      fontWeight: "500"
    },
    textarea: {
      width: "100%",
      maxWidth: "1000px",
      minHeight: "120px", // shorter vertically
      padding: "14px",
      borderRadius: "10px",
      border: "1px solid #cce3d6",
      fontSize: "20px",
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
      fontSize: "20px"
    },
    suggestionsContainer: {
      marginTop: "26px"
    },
    sectionTitle: {
      fontSize: "24px",
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
      fontSize: "21px",
      fontWeight: "600",
      marginBottom: "6px",
      color: "#2d6a4f"
    },
    improvementBox: {
      marginTop: "10px",
      padding: "10px",
      background: "#edf7f1",
      borderRadius: "8px",
      fontSize: "19px",
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
        fontSize: "20px",
        fontWeight: "700",
        color: "#1b4332",
        marginBottom: "6px"
      },
      successMessage: {
        fontSize: "20px",
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
        fontSize: "18px",
        fontWeight: "700"
      },
      tooltipBox: {
        position: "absolute",
        background: "#1b4332",
        color: "white",
        padding: "8px 10px",
        borderRadius: "6px",
        fontSize: "18px",
        marginTop: "6px",
        maxWidth: "220px",
        zIndex: 999
      },tooltipWrapper: {
        position: "relative",
        display: "inline-block"
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
        fontSize: "18px",
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
        <h1 style={styles.title}>Eco-Prompter</h1>
        </div>
        <div style={styles.tagline}>
          Better prompts. Less waste.
        </div>
      </div>

      <textarea
        ref={textareaRef}
        style={{...styles.textarea,  border: lastAdded ? "2px solid #52b788" : "1px solid #cce3d6", 
        background: lastAdded ? "#e6f4ea" : "white",
        transition: "all 0.9s ease"}}
        placeholder="Paste or write your prompt here..."
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setHasEvaluated(false);
          setIsReady(false);
        }}
      />
      {lastAdded && (
        <div style={{
          marginBottom: "12px",
          padding: "10px",
          background: "#d8f3dc",
          borderRadius: "8px",
          fontSize: "16px",
          color: "#1b4332",
          fontWeight: "500"
        }}>
          Added: "{lastAdded}"
        </div>
      )}
      {/* <button style={styles.button} onClick={() => getSuggestion(prompt)}>
        Optimize Prompt
      </button> */}
      {!isReady && (
        <button style={styles.button} onClick={() => getSuggestion(prompt)}>
          Optimize Prompt
        </button>
      )}
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
            +
            </button>
          )}

          {showAllSuggestions && (
            <button
              //style={{ ...styles.button, marginTop: "10px" }}
              style={styles.toggleButton}
              onClick={() => setShowAllSuggestions(false)}
            >
              -
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
                        style={{ ...styles.button, fontSize: "18px", padding: "4px 8px", margin: "3px" }}
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
      ) : hasEvaluated && isReady && (
        <div style={styles.successCard}>
          
          <div style={styles.successTitle}>
            Prompt is ready 
          </div>
      
          <div style={styles.successMessage}>
          Copy the prompt or edit to refine further.
          </div>
      
          {/* FINAL PROMPT DISPLAY
          <div style={{ ...styles.textarea,
            marginTop: "12px",
            padding: "12px",
            background: "white",
            borderRadius: "10px",
            border: "1px solid #cce3d6"
          }}>
            {prompt}
          </div> */}
      
          <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
      
          <button
            onClick={() => navigator.clipboard.writeText(prompt)}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px"
            }}
          >
            <FiCopy size={22} color="#2d6a4f" />
          </button>
      
            {/* <button
              onClick={() => setIsReady(false)}
              style={{
                ...styles.button,
                background: "#40916c"
              }}
            >
              Edit Prompt
            </button> */}
      
          </div>
      
        </div>
      )}
    </main>
  );
}

