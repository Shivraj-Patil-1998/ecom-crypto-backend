const Web3 = require('web3');
// Replace with your QuickNode URL
const quickNodeUrl =
  'https://serene-holy-slug.ethereum-sepolia.quiknode.pro/4ab1f5390b551a245dfdd500995143c9cae3d654/';
// Replace with your wallet details
const senderAddress = '0xCA78D52aC719Ce90610AF8845A282FE50F5840aC';
const privateKey =
  '0x0181ff5603a9e185ba7c41196c6e8c6a7b6cf9c7ae8861b0e184010e3f3c23cb';
// Replace with the recipient address and token details
const recipientAddress = '0x9F1b1E78555E96507D09a10210200a7ceF9e3C0a';
const tokenContractAddress = '0xB2eE34A36c7e4593A1DB6F581304dd04cC896446';
const tokenDecimals = 18; // The number of decimals used by the token
// Initialize Web3 instance
const web3 = new Web3(new Web3.providers.HttpProvider(quickNodeUrl));
// ERC-20 token ABI
const tokenAbi = [
  {
    constant: false,
    inputs: [
      {
        name: '_to',
        type: 'address',
      },
      {
        name: '_value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        name: '',
        type: 'bool',
      },
    ],
    type: 'function',
  },
];
// Create contract instance
const tokenContract = new web3.eth.Contract(tokenAbi, tokenContractAddress);
async function sendToken() {
  const amountToSend = web3.utils
    .toBN(web3.utils.toWei('0.002', 'ether'))
    .div(web3.utils.toBN(10).pow(web3.utils.toBN(18 - tokenDecimals)));
  const tx = {
    from: senderAddress,
    to: tokenContractAddress,
    data: tokenContract.methods
      .transfer(recipientAddress, amountToSend)
      .encodeABI(),
    gas: 2000000,
  };

  console.log('tx', tx);
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

  web3.eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on('receipt', console.log)
    .on('error', console.error);
}

sendToken();
