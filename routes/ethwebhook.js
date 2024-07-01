const express = require('express');
const { ethWebhook } = require('../webhook/eth');
const { usdcWebhook } = require('../webhook/usdc');
const { usdtWebhook } = require('../webhook/usdt');
const { bscusdcWebhook } = require('../webhook/bscusdc');
const { bscusdtWebhook } = require('../webhook/bscusdt');
const { polygonusdcWebhook } = require('../webhook/polygonusdc');
const { polygonusdtWebhook } = require('../webhook/polygonusdt');

const router = express.Router();

// Define the GET route
router.post('/eth', ethWebhook);
router.post('/usdc', usdcWebhook);
router.post('/usdt', usdtWebhook);
router.post('/usdcbsc', bscusdcWebhook);
router.post('/usdtbsc', bscusdtWebhook);
router.post('/usdcpolygon', polygonusdcWebhook);
router.post('/usdtpolygon', polygonusdtWebhook);
// router.post ('/btc', btcWebhook);
// router.post('/usdctron', ethWebhook);
// router.post('/usdttron', ethWebhook);
// router.post('/eth', ethWebhook);

module.exports = router;
