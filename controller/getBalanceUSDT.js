var Web3 = require('web3');
const { ethers } = require('ethers');

// eth balance
async function getBalanceUSDT(req, res) {
  try {
    const { walletAddress } = req.params;
    // const walletAddress = '0xCA78D52aC719Ce90610AF8845A282FE50F5840aC';

    const minABI = [
      // balanceOf
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
    ];
    const endpointUrl =
      'https://empty-muddy-replica.ethereum-sepolia.quiknode.pro/e283e52f6ddd6eb45e91e745c31c5e2913975de0/';
    const httpProvider = new Web3.providers.HttpProvider(endpointUrl);
    const web3Client = new Web3(httpProvider);
    const tokenAddress = '0x10cc8B8910F149ae4Cf81859d05dCDD34b792F7b';
    const contract = new web3Client.eth.Contract(minABI, tokenAddress);
    const result = await contract.methods.balanceOf(walletAddress).call();

    const resultInEther = web3Client.utils.fromWei(result, 'ether');

    // console.log('resultInEther', resultInEther);

    res.json({
      success: true,
      message: 'Fetched USDT balance Successfully',
      body: { resultInEther },
    });
  } catch (error) {
    console.log('failed to get USDT balance ', error);
  }
}
// getBalanceUSDT();
module.exports = {
  getBalanceUSDT,
};
