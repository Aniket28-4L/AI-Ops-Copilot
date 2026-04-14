const { callLLM } = require("../services/llmService");

const detectIntent = async (input) => {
  try {
    const prompt = `
You are an AI intent classifier.

Classify the CURRENT USER MESSAGE only (ignore past context if present).

Categories:
- complaint (user unhappy, refund, issue)
- inquiry (asking questions, info)
- sales (buying intent)
- task (asking to do something)

STRICT RULES:
- Focus ONLY on the latest message
- Do NOT bias toward previous messages
- Return ONLY JSON

Message:
${input.split("Current input:").pop()}

Output:
{
  "intent": ""
}
`;

    const response = await callLLM(prompt);

    const cleaned = response.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Intent Agent Error:", error.message);
    throw new Error("Intent detection failed");
  }
};

module.exports = { detectIntent };