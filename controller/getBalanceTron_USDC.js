const TronWeb = require('tronweb');
const models = require('../models/index');
const { WalletAddress } = models;

async function getUsdcTRONBalance(req, res) {
  try {
    const contractAddress = 'TU2T8vpHZhCNY8fXGVaHyeZrKm8s6HEXWe';
    const { walletAddress } = req.params;
    // const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
    const assetId = 'USDC_TRON';
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

    // console.log(`USDC(TRON) Balance ${finalBalance}`);

    res.json({
      success: true,
      message: 'Fetched USDC(TRON) balance Successfully',
      body: { finalBalance },
    });
  } catch (error) {
    console.error('Error getting USDC(TRON) balance:', error);
  }
}

// getUsdcTRONBalance();

module.exports = {
  getUsdcTRONBalance,
};
