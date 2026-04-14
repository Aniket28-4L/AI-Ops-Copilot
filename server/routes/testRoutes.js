const express = require("express");
const router = express.Router();
const { testAI } = require("../controllers/testController");

router.get("/test-ai", testAI);

module.exports = router;