const { callLLM } = require("../services/llmService");

const testAI = async (req, res) => {
  try {
    const response = await callLLM("Say hello like a smart AI assistant");

    res.json({
      success: true,
      ai: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "AI failed",
    });
  }
};

module.exports = { testAI };