const TronWeb = require('tronweb');
const models = require('../models/index');
const { WalletAddress } = models;

async function getUsdtTRONBalance(req, res) {
  try {
    const contractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';
    const { walletAddress } = req.params;
    // const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
    const assetId = 'USDT_TRON';
    const foundAddress = await WalletAddress.findOne({
      where: {
        address: walletAddress,
        assetId,
      },
    });

    const tronWeb = new TronWeb({
      fullHost: 'https://nile.trongrid.io/',
      privateKey: foundAddress.privateKey,
    });
    const contract = await tronWeb.contract().at(contractAddress);
    const balance = await contract.methods
      .balanceOf(foundAddress.address)
      .call();
    const finalBalance = balance / 1e6;

    // console.log(`USDT(TRON) Balance ${finalBalance}`);

    res.json({
      success: true,
      message: 'Fetched USDT(TRON) balance Successfully',
      body: { finalBalance },
    });
  } catch (error) {
    console.error('Error getting USDT(TRON) balance:', error);
  }
}

// getUsdtTRONBalance();

module.exports = {
  getUsdtTRONBalance,
};
