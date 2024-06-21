const express = require('express');
const { Withdraw } = require('../controller/withdrawController');
const router = express.Router();

// Define the GET route
router.post('/:assetId', Withdraw);

module.exports = router;
