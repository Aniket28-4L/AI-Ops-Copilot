const { callLLM } = require("../services/llmService");

const vectorStore = {};

// 🧠 Generate embedding (lightweight)
const getEmbedding = async (text) => {
  const prompt = `Convert this text into a short semantic representation:\n"${text}"`;
  return await callLLM(prompt);
};

// 💾 Save memory (user + session based)
const saveVectorMemory = async (userId, sessionId, text) => {
  if (!vectorStore[userId]) {
    vectorStore[userId] = {};
  }

  if (!vectorStore[userId][sessionId]) {
    vectorStore[userId][sessionId] = [];
  }

  const embedding = await getEmbedding(text);

  vectorStore[userId][sessionId].push({
    text,
    embedding,
    timestamp: Date.now(),
  });

  // 🔥 LIMIT MEMORY (last 10 only)
  if (vectorStore[userId][sessionId].length > 10) {
    vectorStore[userId][sessionId].shift();
  }
};

// 🔍 Get relevant memory
const getRelevantMemory = async (userId, sessionId, currentInput) => {
  const memories = vectorStore[userId]?.[sessionId] || [];

  if (memories.length === 0) return [];

  const currentEmbedding = await getEmbedding(currentInput);

  const scored = memories.map((m) => ({
    text: m.text,
    score: similarity(m.embedding, currentEmbedding),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 3).map((s) => s.text); // top 3
};

// 🧮 Simple similarity
const similarity = (a, b) => {
  let score = 0;
  const wordsA = a.split(" ");
  const wordsB = b.split(" ");

  wordsA.forEach((word) => {
    if (wordsB.includes(word)) score++;
  });

  return score;
};

module.exports = { saveVectorMemory, getRelevantMemory };