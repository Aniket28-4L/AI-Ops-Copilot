const { detectIntent } = require("../agents/intentAgent");
const { planTasks } = require("../agents/plannerAgent");
const { generateReply } = require("../agents/emailAgent");
const { createTasks } = require("../agents/taskAgent");
const { detectRisk } = require("../agents/riskAgent");

const {
  saveVectorMemory,
  getRelevantMemory,
} = require("../memory/vectorMemory");

const handleAIRequest = async (req, res) => {
  try {
    const {
      input,
      userId = "user1",
      sessionId = "chat1",
    } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Input is required",
      });
    }

    // 🧠 Get smart memory
    const relevantMemory = await getRelevantMemory(
      userId,
      sessionId,
      input
    );

    const context = relevantMemory.join("\n");

    const fullInput = context
      ? `Relevant context:\n${context}\n\nCurrent input:\n${input}`
      : input;

    // Step 1: Intent
    const intentData = await detectIntent(fullInput);

    // Step 2: Planning
    const plan = await planTasks(fullInput, intentData.intent);

    // Normalize tasks
    let taskList = [];

    if (Array.isArray(plan.tasks)) {
      if (typeof plan.tasks[0] === "string") {
        taskList = plan.tasks;
      } else if (typeof plan.tasks[0] === "object") {
        taskList = plan.tasks.map((t) => t.type);
      }
    }

    // Step 3: Execution
    let reply = "";

    if (
      taskList.includes("generate_email_reply") ||
      intentData.intent === "complaint"
    ) {
      reply = await generateReply(fullInput);
    }

    const createdTasks = createTasks(taskList);
    const priority = detectRisk(fullInput);

    // 💾 Save memory properly
    await saveVectorMemory(userId, sessionId, input);

    res.json({
      success: true,
      userId,
      sessionId,
      intent: intentData.intent,
      tasks: taskList,
      reply,
      tasks_created: createdTasks,
      priority,
      memory_used: relevantMemory.length > 0,
      memory_context: relevantMemory,
    });
  } catch (error) {
    console.error("AI Controller Error:", error.message);

    res.status(500).json({
      success: false,
      error: "AI processing failed",
    });
  }
};

module.exports = { handleAIRequest };