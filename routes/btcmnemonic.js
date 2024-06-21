const express = require("express");
const router = express.Router();
const { createMnemonic, getMnemonics } = require("../controller/mnemonic");

// Define the GET route
router.get("/", getMnemonics);
router.post("/create", createMnemonic);

module.exports = router;
