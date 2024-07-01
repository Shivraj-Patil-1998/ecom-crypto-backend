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
const { ethupdateAlert, ethusdcupdateAlert } = require("../services/Notifications/Alert/updatealert");
const { eth_alert_id, usdc_alert_id, usdc_alert_contract, usdt_alert_contract, usdt_alert_id, usdcbsc_alert_contract, usdcbsc_alert_id, usdtbsc_alert_contract, usdtbsc_alert_id, usdcpolygon_alert_id, usdcpolygon_alert_contract, usdtpolygon_alert_contract, usdtpolygon_alert_id } = require("../utils/constant");
const { padHexString } = require("../utils/helper");
const { SubWalletName, SubWalletAddress, WalletAddress, WalletName } = models;
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
async function createSubHDwallet(req, res) {
  try {
    const { walletId } = req.params;
    const { customerId, apiKey, secretKey } = req.body;
    console.log("My keys",apiKey, secretKey )
    console.log("walletId", walletId);

    // Check if the walletId (merchant) exists
    const existingMerchant = await WalletAddress.findOne({
      where: { walletId },
    });

    if (!existingMerchant) {
      return res.status(404).json({
        success: false,
        message: "Merchant does not exist.",
      });
    }

    if (existingMerchant) {
      const storedKeys = await WalletName.findOne({
        where: { walletId },
      });

      if (
        !storedKeys ||
        storedKeys.apiKey !== apiKey ||
        storedKeys.secretKey !== secretKey
      ) {
        return res.status(404).json({
          success: false,
          message: "Invalid API key or Secret key.",
        });
      }
    }

    // Check if the customerId already exists under the given walletId
    const existingCustomer = await SubWalletAddress.findOne({
      where: { walletId, customerId },
    });

    const parsedCustomerId = parseInt(customerId, 10);
    const existingCustomerWallets = await SubWalletAddress.findAll({
      where: { walletId, customerId: parsedCustomerId },
    });
    if (!existingCustomerWallets) {
      return res
        .status(404)
        .json({ error: "Wallets are not found under given merchants" });
    }

    if (existingCustomer) {
      return res.json({
        success: true,
        message: "Your wallets are already created",
        existingCustomerWallets: existingCustomerWallets,
      });
    }

    const lastWalletName = await SubWalletName.findOne({
      order: [["subWalletId", "DESC"]],
    });
    const lastWalletId = lastWalletName ? lastWalletName.subWalletId : 0;
    const subWalletId = lastWalletId + 1;

    //ETHEREUM
    const pathETH = `m/44'/60'/${walletId}'/0/${subWalletId}`;
    const wallet = masterNode.derivePath(pathETH);
    const ethAddress = wallet.address;
    const ethPrivateKey = wallet.privateKey;
    const ethPublicKey = wallet.publicKey;

    const ethnotificationId = `${eth_alert_id}`;
    const ethnotificationExpression = ` || (tx_to == '${ethAddress}')`;
    const ethnotification = await ethupdateAlert(ethnotificationId, ethnotificationExpression);
    const ethalertStatus = ethnotification ? true : false;
    
    const usdchex = await padHexString(ethAddress)
    const usdcethalertexpression = ` || ((tx_logs_address == '${usdc_alert_contract}') && (tx_logs_topic2 == '${usdchex}'))`;
    const usdcnotification = await ethusdcupdateAlert(usdc_alert_id, usdcethalertexpression);
    const usdcethalertStatus = usdcnotification ? true : false;

    const usdthex = await padHexString(ethAddress)
    const usdtethalertexpression = ` || ((tx_logs_address == '${usdt_alert_contract}') && (tx_logs_topic2 == '${usdthex}'))`;
    const usdtnotification = await ethusdcupdateAlert(usdt_alert_id, usdtethalertexpression);
    const usdtethalertStatus = usdtnotification ? true : false; 


    //BITCOIN
    const testnet = bitcoin.networks.testnet;
    const seed = await bip39.mnemonicToSeed(mnemonicGen);
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed, testnet);
    let pathBTC;
    pathCount = 0;
    pathBTC = `m/44'/0'/${walletId}'/0/${subWalletId}`;
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
      `m/44'/195'/${walletId}'/0/${subWalletId}`
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
    
    const bscusdchex = await padHexString(bscAddress)
    const bscusdcethalertexpression = ` || ((tx_logs_address == '${usdcbsc_alert_contract}') && (tx_logs_topic2 == '${bscusdchex}'))`;
    const bscusdcnotification = await ethusdcupdateAlert(usdcbsc_alert_id, bscusdcethalertexpression);
    const bscusdcethalertStatus = bscusdcnotification ? true : false;

    const bscusdthex = await padHexString(bscAddress)
    const bscusdtethalertexpression = ` || ((tx_logs_address == '${usdtbsc_alert_contract}') && (tx_logs_topic2 == '${bscusdthex}'))`;
    const bscusdtnotification = await ethusdcupdateAlert(usdtbsc_alert_id, bscusdtethalertexpression);
    const bscusdtethalertStatus = bscusdtnotification ? true : false; 


    //Polygon
    const web3_polygon = new Web3("https://polygon-rpc.com");
    var polygonWallet = web3_polygon.eth.accounts.privateKeyToAccount(
      wallet.privateKey
    );
    const polygonprivateKey = polygonWallet.privateKey;
    const polygonAddress = polygonWallet.address;

    const plyusdchex = await padHexString(polygonAddress)
    const plyusdcethalertexpression = ` || ((tx_logs_address == '${usdcpolygon_alert_contract}') && (tx_logs_topic2 == '${plyusdchex}'))`;
    const plyusdcnotification = await ethusdcupdateAlert(usdcpolygon_alert_id, plyusdcethalertexpression);
    const plyusdcethalertStatus = plyusdcnotification ? true : false;

    const plyusdthex = await padHexString(polygonAddress)
    const plyusdtethalertexpression = ` || ((tx_logs_address == '${usdtpolygon_alert_contract}') && (tx_logs_topic2 == '${plyusdthex}'))`;
    const plyusdtnotification = await ethusdcupdateAlert(usdtpolygon_alert_id, plyusdtethalertexpression);
    const plyusdtethalertStatus = plyusdtnotification ? true : false;
    //End

    const subWalletAddresses = [
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "ETH",
        alertStatus: ethalertStatus
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: btcprivateKey,
        publicKey: btcpublicKey,
        address: address,
        assetId: "BTC",
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "USDC",
        alertStatus: usdcethalertStatus
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: ethPrivateKey,
        publicKey: ethPublicKey,
        address: ethAddress,
        assetId: "USDT_ERC20",
        alertStatus: usdtethalertStatus
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: trxprivateKey,
        publicKey: trxpublicKey,
        address: trxAddress,
        assetId: "USDT_TRON",
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: trxprivateKey,
        publicKey: trxpublicKey,
        address: trxAddress,
        assetId: "USDC_TRON",
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: bscprivateKey,
        publicKey: ethPublicKey,
        address: bscAddress,
        assetId: "USDC_BSC",
        alertStatus: bscusdcethalertStatus,
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: bscprivateKey,
        publicKey: ethPublicKey,
        address: bscAddress,
        assetId: "USDT_BSC",
        alertStatus: bscusdtethalertStatus,
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: polygonprivateKey,
        publicKey: ethPublicKey,
        address: polygonAddress,
        assetId: "USDC_POLYGON",
        alertStatus: plyusdcethalertStatus
      },
      {
        walletId,
        subWalletId,
        customerId,
        privateKey: polygonprivateKey,
        publicKey: ethPublicKey,
        address: polygonAddress,
        assetId: "USDT_POLYGON",
        alertStatus: plyusdtethalertStatus
      },
    ];

    const existingAddresses = await SubWalletAddress.findAll({
      where: {
        address: subWalletAddresses.map((addr) => addr.address),
      },
    });

    // Filter addresses that do not exist
    const newAddresses = subWalletAddresses.filter(
      (addr) =>
        !existingAddresses.some((existing) => existing.address === addr.address)
    );

    const createWalletName = await SubWalletName.create({
      walletId,
      subWalletId,
      customerId,
    });

    const createSubWalletAddresses = await SubWalletAddress.bulkCreate(
      newAddresses
    );

    res.json({
      success: true,
      message: "Wallet Name and Wallet Addresses Created Successfully",
      body: { createWalletName, createSubWalletAddresses },
    });
  } catch (error) {
    console.log("failed to create wallet", error);
    res.status(500).json({
      success: false,
      message: "Failed to create wallet",
      error: error.message,
    });
  }
}

async function getAllWalleName(req, res) {
  try {
    const subWalletName = await SubWalletName.findAll({
      exclude: ["createdAt", "updatedAt", "deletedAt"],
    });

    return res.status(200).json({ subWalletName });
  } catch (error) {
    console.error("Failed to get all Wallet Name:", error);
    return res.status(500).json({ error: "Failed to get all Wallet Name" });
  }
}

async function getSubWalletAddress(req, res) {
  try {
    const { walletId } = req.params;

    // Fetch the Mnemonic
    const walletName = await SubWalletName.findOne({
      where: { subWalletId: walletId },
      include: SubWalletAddress, // Include associated WalletAddress
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
  createSubHDwallet,
  getAllWalleName,
  getSubWalletAddress,
};
