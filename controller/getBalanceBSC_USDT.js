var Web3 = require('web3');

// USDCERC20 balance
async function getBalanceBSC_USDT(req, res) {
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
      'https://snowy-flashy-log.bsc-testnet.quiknode.pro/bf2dacbef1edf1ce2e4982dd520ff7aa4df16c1a/';
    const httpProvider = new Web3.providers.HttpProvider(endpointUrl);
    const web3Client = new Web3(httpProvider);
    const tokenAddress = '0x3fa2529b98ca9c414d66f85e62f450ebf3b7dd80';
    const contract = new web3Client.eth.Contract(minABI, tokenAddress);
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
// getBalanceBSC_USDT();
module.exports = {
  getBalanceBSC_USDT,
};
