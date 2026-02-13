



(() => {
  const LOG_PREFIX = "✅ ecoprompt";

  console.log(`${LOG_PREFIX} running (prompt detector loaded)`);

  function getTextarea() {
    return document.querySelector("textarea");
  }

  function attachTextareaListener() {
    const textarea = getTextarea();
    if (!textarea) return;

    if (textarea.dataset.ecopromptAttached === "true") return;
    textarea.dataset.ecopromptAttached = "true";

    console.log(`${LOG_PREFIX} attached listener to ChatGPT textarea`);

    textarea.addEventListener("keydown", (e) => {
    
      if (e.isComposing) return;
      if (e.key === "Enter" && !e.shiftKey) {
        const prompt = textarea.value?.trim();
        if (!prompt) return;

        console.log("🚀 PROMPT SUBMITTED (enter):", prompt);
      }
    });
  }

  function attachSendButtonListener() {
    const btn =
      document.querySelector('button[aria-label*="Send"]') ||
      document.querySelector('button[aria-label*="Send message"]') ||
      document.querySelector('button[data-testid*="send"]');

    if (!btn) return;

    if (btn.dataset.ecopromptAttached === "true") return;
    btn.dataset.ecopromptAttached = "true";

    console.log(`${LOG_PREFIX} attached listener to Send button`);

    btn.addEventListener("click", () => {
      const textarea = getTextarea();
      const prompt = textarea?.value?.trim();
      if (!prompt) return;

      console.log("🚀 PROMPT SUBMITTED (click):", prompt);
    });
  }

  function attachAll() {
    attachTextareaListener();
    attachSendButtonListener();
  }
  attachAll();
  const observer = new MutationObserver(attachAll);
  observer.observe(document.body, { childList: true, subtree: true });
})();
