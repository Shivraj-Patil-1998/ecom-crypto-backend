const { ethers } = require('ethers');
const privateKey =
  '0x0181ff5603a9e185ba7c41196c6e8c6a7b6cf9c7ae8861b0e184010e3f3c23cb';
// Replace with the recipient address and token details
const recipientAddress = '0x9F1b1E78555E96507D09a10210200a7ceF9e3C0a';

// Initialize Web3 instance
async function sendToken() {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://serene-holy-slug.ethereum-sepolia.quiknode.pro/4ab1f5390b551a245dfdd500995143c9cae3d654/'
  );
  const signer = new ethers.Wallet(privateKey, provider);

  const tx = await signer.sendTransaction({
    to: recipientAddress,
    value: ethers.utils.parseUnits('0.001', 'ether'),
  });
  console.log(tx);
}

sendToken();
