const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');
const BIP32Factory = require('bip32').default;
const ecc = require('tiny-secp256k1');

const models = require('../models/index');

const { BitcoinWallets, Mnemonic } = models;
const { checkBtcBalance } = require('./helper');
const axios = require('axios');

// Generate a mnemonic
// const mnemonic = bip39.generateMnemonic();
async function createBitcoinWallet(req, res) {
  try {
    const { mnemonicId } = req.params;

    const wallet = await BitcoinWallets.findOne({
      where: { mnemonic: mnemonicId },
      order: [['path', 'DESC']],
      limit: 1,
      include: [{ model: Mnemonic }],
    });

    const foundMnemonic = await Mnemonic.findOne({
      where: { id: mnemonicId },
    });

    if (!foundMnemonic) {
      res.status(500).send({ error: 'Mnemonic not found' });
    }

    // Convert the mnemonic to a seed
    const seed = await bip39.mnemonicToSeed(foundMnemonic.mnemonic);
    // Initialize BIP32 using the tiny-secp256k1 library
    const bip32 = BIP32Factory(ecc);

    // Derive the root node from the seed
    const root = bip32.fromSeed(seed);

    // Derive the first external chain address (m/44'/1'/0'/0/0) for testnet

    let path;

    let pathCount = wallet ? Number(wallet?.path) + 1 : 0;
    console.log('pathCount: ', pathCount);
    if (wallet) {
      path = `m/44'/1'/0'/0/${pathCount}`;
    } else {
      path = `m/44'/1'/0'/0/${pathCount}`;
    }
    const child = root.derivePath(path);

    // Generate a Bitcoin address
    const { address } = bitcoin.payments.p2pkh({
      pubkey: child.publicKey,
      network: bitcoin.networks.testnet,
    });

    if (!address) {
      res.status(500).send({ error: 'Address creation failed' });
    }

    const balanceSatoshis = await checkBtcBalance(address);
    const balanceBTC = (balanceSatoshis || 0) / 100000000; // Convert satoshis to BTC

    let createdBtcWallet = await BitcoinWallets.create({
      address: address,
      mnemonic: mnemonicId,
      balance: balanceBTC || 0,
      path: pathCount,
    });

    if (!createdBtcWallet) {
      res.send({
        success: true,
        message: 'success',
        body: { createdBtcWallet },
      });
    }

    res.send({ success: true, message: 'success', body: { createdBtcWallet } });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function getAddressByMnemonic(req, res) {
  const { menmonicId } = req.params;
  try {
    const addresses = await BitcoinWallets.findAll({
      where: {
        mnemonic: menmonicId,
      },
    });

    res.json({ message: 'success', body: { addresses } });
  } catch (error) {
    console.log('error: ', error);
    throw new Error('Addresses fetch failed');
  }
}

async function createWithdraw(req, res) {
  // try {
  //   const { senderAddress, recipientAddress, amount } = req.body;

  //   const amountValue = parseFloat(amount);

  //   console.log({
  //     senderAddress,
  //     recipientAddress,
  //     amountValue,
  //   });
  //   // Fetch UTXOs and create a new transaction using BlockCypher
  //   const newTx = await axios.post(
  //     `https://api.blockcypher.com/v1/btc/test3/txs/new`,
  //     {
  //       inputs: [{ addresses: [senderAddress] }],
  //       outputs: [{ addresses: [recipientAddress], value: amountValue * 1e8 }],
  //     }
  //   );

  //   console.log({ newTx });

  //   if (!newTx.data) {
  //     return res.status(500).send({ error: "Transaction creation failed" });
  //   }

  //   // Sign each input
  //   newTx.data.tosign.forEach((toSign, index) => {
  //     const keyPair = bitcoin.ECPair.fromWIF(
  //       child.toWIF(),
  //       bitcoin.networks.testnet
  //     );
  //     const signature = keyPair
  //       .sign(Buffer.from(toSign, "hex"))
  //       .toString("hex");
  //     newTx.data.signatures[index] = signature;
  //   });

  //   // Send the signed transaction back to BlockCypher to broadcast
  //   const sendTx = await axios.post(
  //     `https://api.blockcypher.com/v1/btc/test3/txs/send`,
  //     newTx.data
  //   );

  //   if (!sendTx.data || !sendTx.data.tx) {
  //     return res.status(500).send({ error: "Transaction broadcast failed" });
  //   }

  //   res.send({
  //     success: true,
  //     message: "Transaction successful",
  //     // txid: sendTx.data.tx.hash,
  //   });
  // } catch (error) {
  //   res.status(500).send({ error: error.message });
  // }

  try {
    //   const { senderAddress, recipientAddress, amount } = req.body;

    //   const amountValue = parseFloat(amount);
    // Convert the mnemonic to a seed
    const seed = await bip39.mnemonicToSeed(mnemonic);
    // Initialize BIP32 using the tiny-secp256k1 library
    const bip32 = BIP32Factory(ecc);
    const root = bip32.fromSeed(seed);

    // Derive the sender's key pair from the seed
    const path = "m/44'/0'/0'/0/0"; // Replace with appropriate path
    const child = root.derivePath(path);

    const keyPair = bitcoin.ECPair.fromPrivateKey(child.privateKey, {
      network: bitcoin.networks.bitcoin, // Use testnet for testing
    });

    // Fetch UTXOs
    const utxosResponse = await axios.get(
      `https://api.blockcypher.com/v1/btc/main/addrs/${senderAddress}?unspentOnly=true`
    );
    const utxos = utxosResponse.data.txrefs;

    const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });

    let inputAmount = 0;
    utxos.forEach((utxo) => {
      inputAmount += utxo.value;
      psbt.addInput({
        hash: utxo.tx_hash,
        index: utxo.tx_output_n,
        nonWitnessUtxo: Buffer.from(utxo.tx_output_hex, 'hex'),
      });
    });

    const outputAmount = Math.floor(amount * 1e8); // Convert amount to satoshis
    const fee = 10000; // Define a fee
    const change = inputAmount - outputAmount - fee;

    psbt.addOutput({
      address: recipientAddress,
      value: outputAmount,
    });

    if (change > 0) {
      psbt.addOutput({
        address: senderAddress,
        value: change,
      });
    }

    psbt.signAllInputs(keyPair);
    psbt.finalizeAllInputs();

    const tx = psbt.extractTransaction().toHex();

    const broadcastResponse = await axios.post(
      'https://api.blockcypher.com/v1/btc/main/txs/push',
      {
        tx: tx,
      }
    );

    return broadcastResponse.data;
  } catch (error) {
    console.error('Error sending Bitcoin:', error);
    throw new Error('Bitcoin transaction failed');
  }
}

module.exports = {
  createBitcoinWallet,
  getAddressByMnemonic,
  createWithdraw,
};
