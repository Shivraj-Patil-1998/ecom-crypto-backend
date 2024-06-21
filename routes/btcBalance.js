const express = require("express");
const { getBTCBalance } = require("../controller/btcBalController");
const router = express.Router();

// Define the GET route
router.get("/:address", getBTCBalance);

module.exports = router;
