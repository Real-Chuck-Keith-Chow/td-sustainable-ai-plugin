//import {useState} from 'react'; 
 // THIS IS FROM THE YOUTUBE TUTORIAL -- OURS WILL BE DIFF
// const App = () => {
//     const [scriptResp, setScriptResp] = useState(null); 

//     const getSuggestion = async () => {
//          // THIS IS FROM THE YOUTUBE TUTORIAL -- OURS WILL BE DIFF
//         // get users 
//         const resp = await fetch('https://jsonplaceholder.typicode.com/users'); 
//         const users = await resp.json(); 

//         // get email 
//         const randomEmail = users[Math.floor(Math.random() * users.length)].email; 

//         // get active tab 
//         const tabs = await chrome.tabs.query({active: true, currentWindow: true}); 
//         const activeTab = tabs[0]; 

//         //get the response 
//         const tabResp= await chrome.tabs.sendMessage(activeTab.id, randomEmail);
//         setScriptResp(tabResp)

//     };
//     return (
//         <main>
//             <h1> Here is suggestion</h1>
//             <button onClick={getSuggestion}> Get Suggestion</button>
//             <h2> Content Script Says: {scriptResp}</h2>
//             <h3> efijgheitrghiurwiuwrhgwerhuaghsriutghiruthgisrtiuthithihjojrtoijhotjhortjhjrtohjoijrto</h3>

//         </main>
//     );
// }
// export default App; 

import { useState } from "react";
import leafLogo from "../../assets/icons8-leaf-96.png";

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  // const getSuggestion = () => {
  //   setSuggestions([
  //     {
  //       type: "Clarity Improvement",
  //       message: "Your prompt is vague. Add more specificity.",
  //       improvement:
  //         "Explain quantum computing to a beginner using simple analogies and under 300 words."
  //     },
  //     {
  //       type: "Add Constraints",
  //       message: "Define the format of the response.",
  //       improvement:
  //         "Respond in bullet points with short explanations."
  //     },
  //     {
  //       type: "Add Role Context",
  //       message: "Assign a role to improve output quality.",
  //       improvement:
  //         "Act as a senior product manager reviewing this feature idea."
  //     }
  //   ]);
  // };

  const getSuggestion = async () => {
    if (!prompt.trim()) return;
  
    try {
      const response = await fetch("http://localhost:3001/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
  
      const data = await response.json();
      console.log("Response from backend:", data);
  
      // Map backend suggestions into frontend cards
      const formattedSuggestions = data.suggestions.map(s => ({
        type: s.component.charAt(0).toUpperCase() + s.component.slice(1),
        message: s.suggestion
      }));
  
      setSuggestions(formattedSuggestions);
  
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
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button style={styles.button} onClick={getSuggestion}>
        Optimize Prompt
      </button>

      {suggestions.length > 0 && (
        <div style={styles.suggestionsContainer}>
          <h2 style={styles.sectionTitle}>Suggestions</h2>

          {suggestions.map((s, index) => (
            <div key={index} style={styles.card}>
              <div style={styles.cardTitle}>{s.type}</div>
              <p>{s.message}</p>

            </div>
          ))}
        </div>
      )}
    </main>
  );
}

