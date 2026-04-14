require("dotenv").config({ path: "./.env" });

console.log("GROQ KEY:", process.env.GROQ_API_KEY); // ✅ correct key check

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});