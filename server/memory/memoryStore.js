const memory = {};

const saveMemory = (sessionId, data) => {
  if (!memory[sessionId]) {
    memory[sessionId] = [];
  }

  memory[sessionId].push(data);
};

const getMemory = (sessionId) => {
  return memory[sessionId] || [];
};

module.exports = { saveMemory, getMemory };