const express = require('express');
const {
  createhdwallet,
  getAllWalleName,
  getWallet,
} = require('../controller/createWallet');
const router = express.Router();

// Define the GET route
router.post('/create', createhdwallet);
router.get('/', getAllWalleName);
router.get('/:walletId', getWallet);

module.exports = router;
