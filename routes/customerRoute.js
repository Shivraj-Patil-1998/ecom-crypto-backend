const express = require('express');
const {customerAssets} = require('../controller/customerAssets');
const router = express.Router();

// Define the GET route
router.post('/assets', customerAssets);

module.exports = router;
