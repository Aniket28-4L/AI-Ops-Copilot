const express = require("express");
const router = express.Router();
const { getIntent } = require("../controllers/intentController");

router.post("/intent", getIntent);

module.exports = router;