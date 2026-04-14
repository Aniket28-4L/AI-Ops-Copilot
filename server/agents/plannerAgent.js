const { callLLM } = require("../services/llmService");

const planTasks = async (input, intent) => {
  try {
    const prompt = `
You are an AI Task Planner.

Your job is to convert input into tasks.

ONLY choose from:
- generate_email_reply
- create_followup_task
- flag_customer_issue

STRICT RULES:
- Return ONLY JSON
- NO objects
- NO descriptions
- ONLY array of strings

Example:
{
  "tasks": ["generate_email_reply", "flag_customer_issue"]
}

Input:
"${input}"

Intent:
${intent}
`;

    const response = await callLLM(prompt);

    const cleaned = response.replace(/```json|```/g, "").trim();

    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Planner Agent Error:", error.message);
    throw new Error("Task planning failed");
  }
};

module.exports = { planTasks };