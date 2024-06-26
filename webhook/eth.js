const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");
const Web3 = require("web3");
const web3 = new Web3(
  "https://empty-muddy-replica.ethereum-sepolia.quiknode.pro/e283e52f6ddd6eb45e91e745c31c5e2913975de0/"
);

const ethWebhook = async (req, res, next) => {
  try {
    console.log("Received webhook data:", req.body);

    const webhookData = req.body[0];

    if (!webhookData) {
      console.error("Webhook data is empty");
      return res.status(400).send("Invalid webhook data");
    }

    let toAddress = webhookData.to.toLowerCase();

    if (!toAddress) {
      console.error("toAddress is undefined");
      return res.status(400).send("toAddress is missing in webhook data");
    }

    const transactionHash = webhookData.transactionHash;
    const status = webhookData.status === "0x1" ? "COMPLETED" : "FAILED";
    const orderStatus = webhookData.status === "0x1" ? "COMPLETED" : "FAILED";
    const blockNumber = parseInt(webhookData.blockNumber, 16);
    const gasUsed = parseInt(webhookData.gasUsed, 16);
    const effectiveGasPrice = parseInt(webhookData.effectiveGasPrice, 16);
    const cumulativeGasUsed = parseInt(webhookData.cumulativeGasUsed, 16);
    const fromAddress = webhookData.from.toLowerCase();

    const transactionAmount = await web3.eth.getTransaction(transactionHash);

    if (!transactionAmount) {
      console.error(
        `Transaction with hash ${transactionHash} not found on Ethereum`
      );
      return res
        .status(404)
        .send(`Transaction with hash ${transactionHash} not found on Ethereum`);
    }
    const valueInEth = web3.utils.fromWei(transactionAmount.value, "ether");

    const now = new Date();
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    console.log("Current time:", now.toISOString());
    console.log("Ten minutes ago:", tenMinutesAgo.toISOString());

    const transactions = await Transactions.findOne({
      where: {
        toAddress: toAddress,
        assetId: "ETH",
        createdAt: {
          [Op.gt]: tenMinutesAgo,
        },
      },
      order: [["createdAt", "DESC"]],
    });

    if (transactions) {
      transactions.transactionsHash = transactionHash;
      transactions.status = status;
      transactions.orderStatus = orderStatus;
      transactions.blockNumber = blockNumber;
      transactions.gasUsed = gasUsed;
      transactions.effectiveGasPrice = effectiveGasPrice;
      transactions.cumulativeGasUsed = cumulativeGasUsed;
      transactions.fromAddress = fromAddress;
      transactions.amount = valueInEth;

      await transactions.save();
      console.log("transactions updated in database:", transactions.toJSON());

      res
        .status(200)
        .send("Webhook received and transactions updated successfully.");
    } else {
      console.log("No recent transactions found");
      res
        .status(404)
        .send(
          "No matching transactions found for the given toAddress in the last 10 minutes."
        );
    }
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).send("Internal server error.");
  }
};

module.exports = { ethWebhook };
