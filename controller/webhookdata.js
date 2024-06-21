const models = require("../models/index");
const { Transactions } = models;
const { v4: uuidv4 } = require('uuid');

const webhookServer = async (req, res, next) => {
    try {
        const webhookData = req.body;

        if (!Array.isArray(webhookData) || webhookData.length === 0) {
            res.status(400).send({ error: 'Invalid data format or empty array' });
            return;
        }

        const transactionsToCreate = webhookData.map(transactionData => {
            const amount = parseInt(transactionData.value, 16) / Math.pow(10, 18);
            return {
                assetId: 'ETH',
                transactionId: uuidv4(),
                transactiontype: 'INCOMING',
                transactionHash: transactionData.hash,
                fromAddress: transactionData.from,
                toAddress: transactionData.to,
                amount: amount,
                status: transactionData.blockHash !== null ? 'SUCCESS' : 'FAILED',
            };
        });

        const createdTransactions = await Transactions.bulkCreate(transactionsToCreate, { validate: true });

        if (!createdTransactions) {
            res.status(500).send({ error: 'Failed to save Transactions' });
            return;
        }

        res.status(200).send({ message: 'Transactions saved successfully', data: createdTransactions });

    } catch (error) {
        console.error('Error saving transactions:', error);
        res.status(500).json({ error: 'Internal server error' });
        next(error);
    }
};

module.exports = { webhookServer };
