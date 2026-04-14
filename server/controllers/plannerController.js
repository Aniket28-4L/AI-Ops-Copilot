const { detectIntent } = require("../agents/intentAgent");
const { planTasks } = require("../agents/plannerAgent");

const getPlan = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Input is required",
      });
    }

    const intentData = await detectIntent(input);

    const plan = await planTasks(input, intentData.intent);

    res.json({
      success: true,
      intent: intentData.intent,
      tasks: plan.tasks,
    });
  } catch (error) {
    console.error("Planner Controller Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Task planning failed",
    });
  }
};

module.exports = { getPlan };