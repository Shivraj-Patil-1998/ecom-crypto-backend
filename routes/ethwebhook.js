const express = require('express');
const { ethWebhook } = require('../webhook/eth');
const { usdcWebhook } = require('../webhook/usdc');
const { usdtWebhook } = require('../webhook/usdt');

const router = express.Router();

// Define the GET route
router.post('/eth', ethWebhook);
router.post('/usdc', usdcWebhook);
router.post('/usdt', usdtWebhook);
// router.post('/usdctron', ethWebhook);
// router.post('/usdttron', ethWebhook);
// router.post('/usdcpolygon', ethWebhook);
// router.post('/usdtpolygon', ethWebhook);
// router.post('/usdcbsc', ethWebhook);
// router.post('/usdtbsc', ethWebhook);
// router.post('/eth', ethWebhook);

module.exports = router;
