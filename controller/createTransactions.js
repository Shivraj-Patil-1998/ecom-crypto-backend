require("dotenv").config();
const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');

async function createTransactions(req, res) {
  try {
    let {
      assetId,
      transactionId,
      transactiontype,
      toAddress,
      exactAmount,
      amount,
      orderId,
      merchantId,
      customerId,
      orderStatus,
      status,
    } = req.body;

    toAddress = toAddress.toLowerCase();
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    transactionId = uuidv4();

    // Find all transactions within the last 10 minutes for the given toAddress, merchantId, and customerId
    const existingTransactions = await Transactions.findAll({
      where: {
        toAddress,
        merchantId,
        customerId,
        [Op.or]: [
          {
            assetId,
            createdAt: { [Op.gte]: tenMinutesAgo },
          },
          {
            assetId: { [Op.ne]: assetId },
            createdAt: { [Op.gte]: tenMinutesAgo },
            status: 'COMPLETED', // Include COMPLETED transactions in the exemption
          }
        ],
      },
    });

    // Check if there's any transaction with the same assetId in the last 10 minutes
    const sameAssetTransactions = existingTransactions.filter(
      transaction => transaction.assetId === assetId && transaction.status !== 'COMPLETED'
    );

    // If there's any transaction with the same assetId (excluding COMPLETED ones), block the creation
    if (sameAssetTransactions.length > 0) {
      const blockedTransaction = sameAssetTransactions[0];
      return res.status(403).json({
        success: false,
        message: "Transaction creation blocked. Please wait",
        blockedTransaction: {
          transactionId: blockedTransaction.transactionId,
          assetId: blockedTransaction.assetId,
          status: blockedTransaction.status,
          amount: blockedTransaction.exactAmount,
          toAddress: blockedTransaction.toAddress, 
          createdAt: blockedTransaction.createdAt
        }
      });
    }

    // If no transactions with the same assetId (excluding COMPLETED ones) are found, proceed to create the transaction
    const createTransaction = await Transactions.create({
      assetId,
      transactionId,
      transactiontype,
      toAddress,
      exactAmount,
      amount,
      orderId,
      merchantId,
      customerId,
      orderStatus,
      status,
    });

    res.json({
      success: true,
      message: "Transaction Created Successfully",
      body: { createTransaction },
    });
  } catch (error) {
    console.error("Failed to create transaction", error);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: error.message,
    });
  }
}

module.exports = {
  createTransactions,
};
