const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");

const ethWebhook = async (req, res, next) => {
    try {
        console.log('Received webhook data:', req.body);

        const webhookData = req.body[0]; // Assuming webhookData is an array and we need the first element

        if (!webhookData) {
            console.error('Webhook data is empty');
            return res.status(400).send('Invalid webhook data');
        }

        let toAddress = webhookData.to.toLowerCase(); // Convert to lowercase for consistency

        if (!toAddress) {
            console.error('toAddress is undefined');
            return res.status(400).send('toAddress is missing in webhook data');
        }

        const transactionHash = webhookData.transactionHash;
        const status = webhookData.status === '0x1' ? 'COMPLETED' : 'FAILED';
        const blockNumber = parseInt(webhookData.blockNumber, 16);
        const gasUsed = parseInt(webhookData.gasUsed, 16);
        const effectiveGasPrice = parseInt(webhookData.effectiveGasPrice, 16);
        const cumulativeGasUsed = parseInt(webhookData.cumulativeGasUsed, 16);

        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    
        console.log("Current time:", now.toISOString());
        console.log("Ten minutes ago:", tenMinutesAgo.toISOString());

        const transactions = await Transactions.findAll({
            where: {
                toAddress: toAddress, // Ensure you use the lowercase version here
                assetId: 'ETH',
                createdAt: {
                    [Op.gt]: tenMinutesAgo
                }
            },
            order: [['createdAt', 'DESC']] 
        });

        console.log("Transactions found:", transactions.length);

        if (transactions.length > 0) {
            for (let transaction of transactions) {
                transaction.transactionHash = transactionHash;
                transaction.status = status;
                transaction.blockNumber = blockNumber;
                transaction.gasUsed = gasUsed;
                transaction.effectiveGasPrice = effectiveGasPrice;
                transaction.cumulativeGasUsed = cumulativeGasUsed;

                await transaction.save();
                console.log('Transaction updated in database:', transaction.toJSON());
            }

            res.status(200).send('Webhook received and transactions updated successfully.');
        } else {
            console.log("No recent transactions found");
            res.status(404).send('No matching transactions found for the given toAddress in the last 10 minutes.');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Internal server error.');
    }
};


module.exports = { ethWebhook };