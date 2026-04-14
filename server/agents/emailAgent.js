const { callLLM } = require("../services/llmService");

const generateReply = async (input) => {
  try {
    const prompt = `
You are a professional customer support assistant.

Write a COMPLETE email reply.

STRICT RULES:
- Max 150 words
- Do NOT repeat words
- Do NOT loop
- Must end properly
- No placeholders like [Your Name]
- No "Subject:" repetition

Structure:
- Greeting
- Acknowledge issue
- Provide resolution or next step
- Closing

User message:
"${input}"
`;

    const response = await callLLM(prompt);

    // 🔥 CLEAN LOOPING TEXT
    let cleaned = response;

    // remove repeated patterns like "sub sub subj"
    cleaned = cleaned.replace(/\b(\w+)(\s+\1\b)+/gi, "$1");

    // cut overly long responses (safety)
    if (cleaned.length > 1000) {
      cleaned = cleaned.slice(0, 1000);
    }

    return cleaned.trim();
  } catch (error) {
    console.error("Email Agent Error:", error.message);
    throw new Error("Email generation failed");
  }
};

module.exports = { generateReply };