const express = require('express');
const { webhookServer } = require('../controller/webhookdata');

const router = express.Router();

// Define the POST route
router.post('/', webhookServer);

module.exports = router;
