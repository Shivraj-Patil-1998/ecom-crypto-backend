const TronWeb = require('tronweb');
const { HttpProvider } = TronWeb.providers;
const fullNode = new TronWeb.providers.HttpProvider('https://api.trongrid.io');
const solidityNode = new HttpProvider('https://api.trongrid.io');
const eventServer = new HttpProvider('https://api.trongrid.io');

// Create TronWeb instance
const tronWeb12 = new TronWeb(fullNode, solidityNode, eventServer);

async function getTronWalletBalance() {
  try {
    const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
    const balance = await tronWeb12.trx.getBalance(walletAddress);
    const TRXBalance = tronWeb12.fromSun(balance);

    console.log('Your Tron wallet balance:', TRXBalance);
  } catch (error) {
    console.error('Error fetching balance:', error);
  }
}

getTronWalletBalance();

const TronWeb = require('tronweb');
// Configuration for Shasta Testnet
const tronWeb = new TronWeb({
  fullHost: 'https://api.shasta.trongrid.io',
  // Your private key here (optional if you don't need to sign transactions)
  privateKey:
    'CD00E4F78694B33B9F1204AEBAA82171A13A1EF9AB259AA1EB87657659A8E57D',
});
// ABI for TRC20 token balanceOf function
const abi = [
  {
    constant: true,
    inputs: [
      {
        name: '_owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        name: 'balance',
        type: 'uint256',
      },
    ],
    type: 'function',
  },
];
// Function to get token balance
async function getTokenBalance(contractAddress, walletAddress) {
  try {
    const contract = await tronWeb.contract(abi, contractAddress);
    const balance = await contract.balanceOf(walletAddress).call();
    console.log(
      `Token balance of address ${walletAddress}: ${balance / 1e18} TOKEN`
    );
  } catch (error) {
    console.error('Error getting token balance:', error);
  }
}
// Replace with your TRC20 token contract address and Tron wallet address
const tokenContractAddress = 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs';
const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';

getTokenBalance(tokenContractAddress, walletAddress);

// =============================================================
// const TronWeb = require('tronweb');
// // Configuration for Shasta Testnet
// const tronWeb = new TronWeb({
//   fullHost: 'https://api.shasta.trongrid.io',
//   // Your private key here (optional if you don't need to sign transactions)
//   privateKey:
//     'CD00E4F78694B33B9F1204AEBAA82171A13A1EF9AB259AA1EB87657659A8E57D',
// });
// // Function to get balance
// async function getBalance(address) {
//   try {
//     const balance = await tronWeb.trx.getBalance(address);
//     console.log(`Balance of address ${address}: ${balance / 1e6} TRX`);
//   } catch (error) {
//     console.error('Error getting balance:', error);
//   }
// }
// // Replace with your Tron wallet address
// const walletAddress = 'TXHABjEsGH1eVkhhQeaAMdsJHAtt7PrWTg';
// getBalance(walletAddress);
