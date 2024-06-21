var Web3 = require('web3');

// USDCERC20 balance
async function getBalanceUSDCERC20(req, res) {
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
    const tokenAddress = '0xB2eE34A36c7e4593A1DB6F581304dd04cC896446';
    const contract = new web3Client.eth.Contract(minABI, tokenAddress);
    // const walletAddress = '0xCA78D52aC719Ce90610AF8845A282FE50F5840aC';
    const result = await contract.methods.balanceOf(walletAddress).call();
    const resultInEther = web3Client.utils.fromWei(result, 'ether');
    // console.log('resultInEther', resultInEther);
    res.json({
      success: true,
      message: 'Fetched USDCERC20 balance Successfully',
      body: { resultInEther },
    });
  } catch (error) {
    console.log('failed to get USDCERC20 balance ', error);
  }
}
// getBalanceUSDCERC20();
module.exports = {
  getBalanceUSDCERC20,
};
