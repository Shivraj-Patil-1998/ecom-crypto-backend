var Web3 = require('web3');
const { ethers } = require('ethers');

// eth balance
async function getBalanceETH(req, res) {
  try {
    const { walletAddress } = req.params;
    // const walletAddress = '0xCA78D52aC719Ce90610AF8845A282FE50F5840aC';
    const testnet =
      'https://empty-muddy-replica.ethereum-sepolia.quiknode.pro/e283e52f6ddd6eb45e91e745c31c5e2913975de0/';
    const web3 = new Web3(new Web3.providers.HttpProvider(testnet));
    const balance = web3.eth.getBalance(walletAddress);
    const etherAmount = ethers.utils.formatEther(await balance);
    console.log('etherAmount', etherAmount);
    res.json({
      success: true,
      message: 'Fetched ETH balance Successfully',
      body: { etherAmount },
    });
  } catch (error) {
    console.log('failed to get ETH balance ', error);
  }
}
// getBalanceETH();
module.exports = {
  getBalanceETH,
};
