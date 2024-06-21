const { ethers } = require('ethers');
const Web3 = require('web3');
// Generate a 24-word mnemonic
const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
console.log('Mnemonic:', mnemonic);
// Generate the master node
const masterNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
console.log('Master Key:', masterNode.privateKey);
// Define coin types
const COIN_TYPES = {
  ETH: 60,
  USDC_ERC20: 60,
  USDT_ERC20: 60,
  USDC_BSC: 60,
  USDT_BSC: 60,
  USDC_TRC20: 195,
  USDT_TRC20: 195,
  BTC: 0,
  USDT_POLYGON: 60,
  USDC_POLYGON: 60,
};
function getMerchantWallet(coinType, merchantIndex) {
  const path = `m/44'/${coinType}'/${merchantIndex}'/0/0`;
  const wallet = masterNode.derivePath(path);
  return wallet;
}
function getCustomerWallet(merchantWallet, customerIndex) {
  const path = `${merchantWallet.path}/${customerIndex}`;
  const wallet = masterNode.derivePath(path);
  return wallet;
}
// Example: Derive wallet for merchant 0 with ETH
const merchantIndex = 0;
const coinType = COIN_TYPES.ETH;
const merchantWallet = getMerchantWallet(coinType, merchantIndex);
console.log('Merchant 0 Wallet Address (ETH):', merchantWallet.address);
// Example: Derive wallet for customer 0 of merchant 0 with ETH
const customerIndex = 0;
const customerWallet = getCustomerWallet(merchantWallet, customerIndex);
console.log(
  'Customer 0 Wallet Address (Merchant 0, ETH):',
  customerWallet.address
);
// Example: Derive wallet for merchant 0 with BTC
const btcCoinType = COIN_TYPES.BTC;
const btcMerchantWallet = getMerchantWallet(btcCoinType, merchantIndex);
console.log('Merchant 0 Wallet Address (BTC):', btcMerchantWallet.address);
// Example: Derive wallet for customer 0 of merchant 0 with BTC
const btcCustomerWallet = getCustomerWallet(btcMerchantWallet, customerIndex);
console.log(
  'Customer 0 Wallet Address (Merchant 0, BTC):',
  btcCustomerWallet.address
);

// =======================================================

const { ethers } = require('ethers');
const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const tronWeb = require('tronweb');
// Generate a 24-word mnemonic
const mnemonic = bip39.generateMnemonic();
console.log('Mnemonic:', mnemonic);
// Generate the master node for Ethereum
const ethMasterNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
console.log('ETH Master Key:', ethMasterNode.privateKey);
// Define coin types
const COIN_TYPES = {
  ETH: 60,
  BTC: 0,
  TRX: 195,
};
function getEthWallet(masterNode, merchantIndex) {
  const path = `m/44'/${COIN_TYPES.ETH}'/${merchantIndex}'/0/0`;
  const wallet = masterNode.derivePath(path);
  return wallet;
}
function getBtcWallet(mnemonic, merchantIndex) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bitcoin.bip32.fromSeed(seed);
  const path = `m/44'/${COIN_TYPES.BTC}'/${merchantIndex}'/0/0`;
  const wallet = root.derivePath(path);
  const { address } = bitcoin.payments.p2pkh({ pubkey: wallet.publicKey });
  return { address, privateKey: wallet.toWIF() };
}
function getTrxWallet(mnemonic, merchantIndex) {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = tronWeb.utils.crypto.getHDNodeFromSeed(seed);
  const path = `m/44'/${COIN_TYPES.TRX}'/${merchantIndex}'/0/0`;
  const wallet = root.derivePath(path);
  const address = tronWeb.address.fromPublicKey(
    wallet.publicKey.toString('hex')
  );
  const privateKey = wallet.privateKey.toString('hex');
  return { address, privateKey };
}
// Example: Derive wallet for merchant 0 with ETH
const as = 0;
const ethWallet = getEthWallet(ethMasterNode, merchantIndex);
console.log('Merchant 0 Wallet Address (ETH):', ethWallet.address);
// Example: Derive wallet for merchant 0 with BTC
const btcWallet = getBtcWallet(mnemonic, merchantIndex);
console.log('Merchant 0 Wallet Address (BTC):', btcWallet.address);
// Example: Derive wallet for merchant 0 with TRX
const trxWallet = getTrxWallet(mnemonic, merchantIndex);
console.log('Merchant 0 Wallet Address (TRX):', trxWallet.address);
// Using web3 to interact with Ethereum or other EVM-compatible networks
const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID');
// Example: Check balance of a wallet address
async function checkBalance(walletAddress) {
  const balance = await web3.eth.getBalance(walletAddress);
  console.log(
    `Balance of ${walletAddress}:`,
    web3.utils.fromWei(balance, 'ether'),
    'ETH'
  );
}
// Check balance of Merchant 0 Wallet Address (ETH)
checkBalance(ethWallet.address);
