const express = require("express");
const router = express.Router();
const {
  createBitcoinWallet,
  getAddressByMnemonic,
  createWithdraw,
} = require("../controller/bitcoinController");

// Define the GET route
router.post("/withdraw", createWithdraw);
router.post("/:mnemonicId", createBitcoinWallet);
router.get("/:menmonicId", getAddressByMnemonic);

module.exports = router;
