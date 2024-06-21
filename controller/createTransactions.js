require("dotenv").config();
const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");

async function createTransactions(req, res) {
  try {
    const {
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

   
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);

    
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

    if (existingTransactions.length > 0) {
     
      const isAllowed = existingTransactions.some(
        (transaction) => transaction.assetId !== assetId
      );

      if (!isAllowed) {
        
        return res.status(403).json({
          success: false,
          message: "Transaction creation blocked. Please wait for 10 minutes.",
        });
      }
    }

    
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
