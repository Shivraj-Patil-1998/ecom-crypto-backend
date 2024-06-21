const { getDefaultProvider, Wallet, utils } = require("ethers");
const { formatEther, HDNode } = require("ethers/lib/utils");
const { writeFileSync, existsSync, readFileSync } = require("fs");
const qr = require("qrcode");
const models = require("../models/index");

const { EtherWallets } = models;

function _generateMnemonic() {
  const wallet = Wallet.fromMnemonic(
    utils.entropyToMnemonic(utils.randomBytes(32))
  );
  let mnemonic = wallet.mnemonic.phrase;
  return { mnemonic };
}

function _store(_privateKey, _publicKey, _address) {
  const accountOne = {
    privateKey: _privateKey,
    publicKey: _publicKey,
    address: _address,
  };
  const accountOneData = JSON.stringify(accountOne);
  writeFileSync("etherKeys.json", accountOneData);
}

async function createWallet(req, res) {
  const { mnemonic } = _generateMnemonic();

  try {
    const createdWallet = HDNode.fromMnemonic(mnemonic);

    if (!createdWallet) {
      res.status(500).send({ error: "Failed to create wallet" });
    }

    const { privateKey, publicKey, address } = createdWallet;

    const wallet = await EtherWallets.create({
      privateKey,
      publicKey,
      address,
    });

    if (!wallet) {
      res.status(500).send({ error: "Failed to save a wallet" });
    }
    // _store(privateKey, publicKey, fromAddress);

    if (createdWallet) {
      res.send({
        success: true,
        message: "Wallet Created Successfully",
        body: {
          privateKey,
          publicKey,
          address,
        },
      });
    }
  } catch (error) {
    res.status(500).send({ error: "Failed to fetch balance" });
  }
}

module.exports = {
  createWallet,
};
