const TronWeb = require('tronweb');

// Configuration for Shasta Testnet
const tronWeb = new TronWeb({
  fullHost: 'https://nile.trongrid.io/',
  privateKey:
    'CD00E4F78694B33B9F1204AEBAA82171A13A1EF9AB259AA1EB87657659A8E57D',
});

// Function to get balance of TRX
async function getTrxBalance(address) {
  try {
    const balance = await tronWeb.trx.getBalance(address);
    console.log(`Balance of address ${address}: ${balance / 1e6} TRX`);
  } catch (error) {
    console.error('Error getting TRX balance:', error);
  }
}

// Function to get balance of USDT
async function getUsdtBalance(address, contractAddress) {
  try {
    const contract = await tronWeb.contract().at(contractAddress);
    const balance = await contract.methods.balanceOf(address).call();
    console.log(`USDT Balance of address ${address}: ${balance / 1e6} USDT`);
  } catch (error) {
    console.error('Error getting USDT balance:', error);
  }
}

// Replace with your Tron wallet address
const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
// Replace with your USDT contract address
const usdtContractAddress = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

getTrxBalance(walletAddress);
getUsdtBalance(walletAddress, usdtContractAddress);
