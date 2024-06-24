const { Op } = require("sequelize");
const models = require("../models/index");
const { Transactions } = models;
const { v4: uuidv4 } = require('uuid');

async function createTransactions(req, res) {
  try {
    // Destructure data from req.body
    let {
      assetId,
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

    // Generate a UUID for transactionId
    const transactionId = uuidv4();

    // Convert toAddress to lowercase
    toAddress = toAddress.toLowerCase();

    // Define a time threshold (10 minutes ago)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    // Query existing transactions within the last 10 minutes for the same criteria
    const existingTransactions = await Transactions.findAll({
      where: {
        [Op.and]: [
          { toAddress },
          { merchantId },
          { customerId },
          {
            [Op.or]: [
              {
                [Op.and]: [
                  { assetId },
                  { createdAt: { [Op.gte]: tenMinutesAgo } },
                ],
              },
              {
                [Op.and]: [
                  { assetId: { [Op.ne]: assetId } },
                  { createdAt: { [Op.gte]: tenMinutesAgo } },
                ],
              },
            ],
          },
        ],
      },
    });

    // Check if there are existing transactions
    if (existingTransactions.length > 0) {
      // Check if any existing transaction allows the new one based on assetId
      const isAllowed = existingTransactions.some(
        (transaction) => transaction.assetId !== assetId
      );

      // If not allowed, return 403 Forbidden status
      if (!isAllowed) {
        return res.status(403).json({
          success: false,
          message: "Transaction creation blocked. Please wait for 10 minutes.",
        });
      }
    }

    // Create the new transaction in the database
    const createTransaction = await Transactions.create({
      assetId,
      transactionId,
      transactiontype,
      toAddress, // This will be the lowercase version
      exactAmount,
      amount,
      orderId,
      merchantId,
      customerId,
      orderStatus,
      status,
    });

    // Return success response
    res.json({
      success: true,
      message: "Transaction Created Successfully",
      body: { createTransaction },
    });
  } catch (error) {
    // Handle any errors that occur during transaction creation
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
