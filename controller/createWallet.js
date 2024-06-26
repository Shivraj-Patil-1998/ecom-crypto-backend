const bip39 = require("bip39");
const { HDNode } = require("ethers/lib/utils");
const bitcoin = require("bitcoinjs-lib");
const BIP32Factory = require("bip32").default;
const ecc = require("tiny-secp256k1");
const TronWeb = require("tronweb");
var Web3 = require("web3");
const { ethers } = require("ethers");
require("dotenv").config();
const models = require("../models/index");
const { WalletName, WalletAddress } = models;
const { v4: uuidv4 } = require("uuid");
// const mnemonicGen = `${process.env.MASTER_MNEMONIC}`;
const mnemonicGen =
  "wish device moment funny session emerge scare pyramid have impact guitar wonder";
const masterNode = ethers.utils.HDNode.fromMnemonic(mnemonicGen);

// const COIN_TYPES = {
//   ETH: 60,
//   USDC_ERC20: 60,
//   USDT_ERC20: 60,
//   USDC_BSC: 60,
//   USDT_BSC: 60,
//   USDC_TRC20: 195,
//   USDT_TRC20: 195,
//   BTC: 0,
//   USDT_POLYGON: 60,
//   USDC_POLYGON: 60,
// };
// Create Multi Currency Wallet
async function createhdwallet(req, res) {
  try {
    const lastWalletName = await WalletName.findOne({
      order: [["walletId", "DESC"]],
    });
    const lastWalletId = lastWalletName ? lastWalletName.walletId : 0;
    const walletId = lastWalletId + 1;

    const apiKey = uuidv4();
    const secretKey = uuidv4();

    //ETHEREUM
    const pathETH = `m/44'/60'/${walletId}'/0/0`;
    const wallet = masterNode.derivePath(pathETH);
    const ethAddress = wallet.address;
    const ethPrivateKey = wallet.privateKey;
    const ethPublicKey = wallet.publicKey;

    //BITCOIN
    const testnet = bitcoin.networks.testnet;
    const seed = await bip39.mnemonicToSeed(mnemonicGen);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, testnet);
    let pathBTC;
    pathCount = 0;
    pathBTC = `m/44'/0'/${walletId}'/0/0`;
    const child = root.derivePath(pathBTC);
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.testnet,
    });
    const btcprivateKey = child.privateKey.toString("hex");
    const btcpublicKey = child.publicKey.toString("hex");

    //TRON
    const HttpProvider = TronWeb.providers.HttpProvider;
    const fullNode = new HttpProvider("https://api.trongrid.io");
    const solidityNode = new HttpProvider("https://api.trongrid.io");
    const eventServer = new HttpProvider("https://api.trongrid.io");
    const tronWeb = new TronWeb(fullNode, solidityNode, eventServer);
    const trxResult = tronWeb.fromMnemonic(
      mnemonicGen,
      `m/44'/195'/${walletId}'/0/0`
    );
    const trxprivateKey = trxResult.privateKey;
    const trxpublicKey = trxResult.publicKey;
    const trxAddress = trxResult.address;

    //BSC
    const web3_bsc = new Web3("https://bsc-dataseed1.binance.org:443");
    var bscWallet = web3_bsc.eth.accounts.privateKeyToAccount(
      wallet.privateKey
    );
    const bscprivateKey = bscWallet.privateKey;
    const bscAddress = bscWallet.address;

    //Polygon
    const web3_polygon = new Web3("https://polygon-rpc.com");
    var polygonWallet = web3_polygon.eth.accounts.privateKeyToAccount(
      wallet.privateKey
    );
    const polygonprivateKey = polygonWallet.privateKey;
    const polygonAddress = polygonWallet.address;
    //End

    const walletAddresses = [
      {
        walletId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "ETH",
      },
      {
        walletId,
        privateKey: btcprivateKey,
        publicKey: btcpublicKey,
        address: address,
        assetId: "BTC",
      },
      {
        walletId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "USDC",
      },
      {
        walletId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "USDT_ERC20",
      },
      {
        walletId,
        privateKey: trxprivateKey,
        publicKey: trxpublicKey,
        address: trxAddress,
        assetId: "USDT_TRON",
      },
      {
        walletId,
        privateKey: trxprivateKey,
        publicKey: trxpublicKey,
        address: trxAddress,
        assetId: "USDC_TRON",
      },
      {
        walletId,
        privateKey: bscprivateKey,
        publicKey: ethPublicKey,
        address: bscAddress,
        assetId: "USDC_BSC",
      },
      {
        walletId,
        privateKey: bscprivateKey,
        publicKey: ethPublicKey,
        address: bscAddress,
        assetId: "USDT_BSC",
      },
      {
        walletId,
        privateKey: polygonprivateKey,
        publicKey: ethPublicKey,
        address: polygonAddress,
        assetId: "USDC_POLYGON",
      },
      {
        walletId,
        privateKey: polygonprivateKey,
        publicKey: ethPublicKey,
        address: polygonAddress,
        assetId: "USDT_POLYGON",
      },
    ];

    const existingAddresses = await WalletAddress.findAll({
      where: {
        address: walletAddresses.map((addr) => addr.address),
      },
    });

    // Filter addresses that do not exist
    const newAddresses = walletAddresses.filter(
      (addr) =>
        !existingAddresses.some((existing) => existing.address === addr.address)
    );

    const createWalletName = await WalletName.create({
      walletId: walletId,
      walletName: "turbo_nodes_wallet_" + walletId,
      apiKey: apiKey,
      secretKey: secretKey,
    });

    const createWalletAddresses = await WalletAddress.bulkCreate(newAddresses);

    res.json({
      success: true,
      message: "Wallet Name and Wallet Addresses Created Successfully",
      body: { createWalletName, createWalletAddresses },
    });
  } catch (error) {
    console.log("failed to create wallet", error);
  }
}

async function getAllWalleName(req, res) {
  try {
    const walletName = await WalletName.findAll({
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    });

    return res.status(200).json({ walletName });
  } catch (error) {
    console.error("Failed to get all Wallet Name:", error);
    return res.status(500).json({ error: "Failed to get all Wallet Name" });
  }
}

async function getWallet(req, res) {
  try {
    const { walletId } = req.params;

    // Fetch the Mnemonic
    const walletName = await WalletName.findOne({
      where: { walletId: walletId },
      include: WalletAddress, // Include associated WalletAddress
    });

    if (!walletName) {
      return res.status(404).json({ error: "Wallet Name not found" });
    }

    return res.status(200).json({ walletName });
  } catch (error) {
    console.error("Failed to get Wallet Name:", error);
    return res.status(500).json({ error: "Failed to get Wallet Name" });
  }
}

module.exports = {
  createhdwallet,
  getAllWalleName,
  getWallet,
};
