const express = require('express');
const {
  createSubHDwallet,
  getAllWalleName,
  getSubWalletAddress,
} = require('../controller/createSubWallet');
const router = express.Router();

// Define the GET route
router.post('/:walletId', createSubHDwallet);
router.get('/getSubWallets', getAllWalleName);
router.get('/getSubWallets/:walletId', getSubWalletAddress);

module.exports = router;
