const express = require("express");
const cors = require("cors");

const testRoutes = require("./routes/testRoutes");
const intentRoutes = require("./routes/intentRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Ops Copilot Running 🚀");
});

app.use("/api", testRoutes);
app.use("/api", intentRoutes);
app.use("/api", plannerRoutes);
app.use("/api", aiRoutes);

module.exports = app;