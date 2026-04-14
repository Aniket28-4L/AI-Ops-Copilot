const express = require("express");
const router = express.Router();
const { getPlan } = require("../controllers/plannerController");

router.post("/plan", getPlan);

module.exports = router;