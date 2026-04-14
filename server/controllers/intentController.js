const { detectIntent } = require("../agents/intentAgent");

const getIntent = async (req, res) => {
  try {
    const { input } = req.body;

    if (!input) {
      return res.status(400).json({
        success: false,
        error: "Input is required",
      });
    }

    const result = await detectIntent(input);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Controller Error:", error.message);

    res.status(500).json({
      success: false,
      error: "Intent detection failed",
    });
  }
};

module.exports = { getIntent };