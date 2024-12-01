const express = require("express");
const { chat, parseData } = require("../controllers/dataChatController");

const router = express.Router();

router.post("/chat", chat);
router.post("/parseData", parseData)

module.exports = router;
