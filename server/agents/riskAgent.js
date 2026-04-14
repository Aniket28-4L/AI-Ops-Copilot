const detectRisk = (input) => {
  const lowerInput = input.toLowerCase();

  if (
    lowerInput.includes("angry") ||
    lowerInput.includes("refund") ||
    lowerInput.includes("complaint")
  ) {
    return "high";
  }

  return "normal";
};

module.exports = { detectRisk };