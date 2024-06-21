const express = require('express');
const router = express.Router();
const { getBalanceUSDCERC20 } = require('../controller/getBalanceUSDCERC20');
const { getBalanceETH } = require('../controller/getBalanceEth');
const { getBalanceUSDT } = require('../controller/getBalanceUSDT');
const { getBalanceBSC_USDC } = require('../controller/getBalanceBSC_USDC');
const { getBalanceBSC_USDT } = require('../controller/getBalanceBSC_USDT');
const {
  getBalancePolygon_USDC,
} = require('../controller/getBalancePolygon_USDC');
const {
  getBalancePolygon_USDT,
} = require('../controller/getBalancePolygon_USDT');
const { getBTCBalance } = require('../controller/btcBalController');
const { getUsdtTRONBalance } = require('../controller/getBalanceTron_USDT');
const { getUsdcTRONBalance } = require('../controller/getBalanceTron_USDC');

// Define the GET route
router.get('/eth/:walletAddress', getBalanceETH);
router.get('/usdcerc20/:walletAddress', getBalanceUSDCERC20);
router.get('/usdt/:walletAddress', getBalanceUSDT);
router.get('/bsc_usdc/:walletAddress', getBalanceBSC_USDC);
router.get('/bsc_usdt/:walletAddress', getBalanceBSC_USDT);
router.get('/polygon_usdc/:walletAddress', getBalancePolygon_USDC);
router.get('/polygon_usdt/:walletAddress', getBalancePolygon_USDT);
router.get('/btc/:walletAddress', getBTCBalance);
router.get('/usdt_tron/:walletAddress', getUsdtTRONBalance);
router.get('/usdc_tron/:walletAddress', getUsdcTRONBalance);

module.exports = router;
