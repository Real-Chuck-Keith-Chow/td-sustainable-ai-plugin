(() => {
  const LOG = "✅ ecoprompt";
  console.log(`${LOG} running (prompt detector loaded)`);

  const getTextarea = () => document.querySelector("textarea");

  const getPrompt = () => {
    const t = getTextarea();
    return t?.value?.trim() || "";
  };

  const logPrompt = (source) => {
    const prompt = getPrompt();
    console.log(`${LOG} ${source} prompt=`, prompt); // debug line
    if (!prompt) return;
    console.log(`🚀 PROMPT SUBMITTED (${source}):`, prompt);

    // later:
    // chrome.runtime.sendMessage({ type: "PROMPT_SUBMITTED", prompt });
  };

  function attach() {
    const textarea = getTextarea();
    if (textarea && !textarea.dataset.ecopromptKeyAttached) {
      textarea.dataset.ecopromptKeyAttached = "true";
      console.log(`${LOG} attached listener to ChatGPT textarea`);

      textarea.addEventListener("keydown", (e) => {
        if (e.isComposing) return;
        if (e.key === "Enter" && !e.shiftKey) {
          // capture immediately before the app clears it
          logPrompt("enter");
        }
      });
    }

    const sendBtn =
      document.querySelector('button[aria-label*="Send"]') ||
      document.querySelector('button[aria-label*="Send message"]') ||
      document.querySelector('button[data-testid*="send"]');

    if (sendBtn && !sendBtn.dataset.ecopromptBtnAttached) {
      sendBtn.dataset.ecopromptBtnAttached = "true";
      console.log(`${LOG} attached listener to Send button`);

      // pointerdown happens BEFORE click (so we catch text before it disappears)
      sendBtn.addEventListener("pointerdown", () => logPrompt("pointerdown"), true);
      sendBtn.addEventListener("mousedown", () => logPrompt("mousedown"), true);
      sendBtn.addEventListener("click", () => logPrompt("click"), true);
    }
  }

  attach();
  new MutationObserver(attach).observe(document.body, { childList: true, subtree: true });
})();

