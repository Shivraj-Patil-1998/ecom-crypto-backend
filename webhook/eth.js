const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");

const ethWebhook = async (req, res, next) => {
    try {
        // Debugging log for webhookData
        console.log('Received webhook data:', req.body);

        const webhookData = req.body[0]; // Assuming webhookData is an array and we need the first element

        if (!webhookData) {
            console.error('Webhook data is empty');
            return res.status(400).send('Invalid webhook data');
        }

        const toAddress = webhookData.to;

        if (!toAddress) {
            console.error('toAddress is undefined');
            return res.status(400).send('toAddress is missing in webhook data');
        }

        const transactionHash = webhookData.transactionHash;
        const status = webhookData.status === '0x1' ? 'COMPLETED' : 'FAILED';
        const orderStatus = webhookData.status === '0x1' ? 'COMPLETED' : 'FAILED';
        const blockNumber = parseInt(webhookData.blockNumber, 16);
        const gasUsed = parseInt(webhookData.gasUsed, 16);
        const effectiveGasPrice = parseInt(webhookData.effectiveGasPrice, 16);
        const cumulativeGasUsed = parseInt(webhookData.cumulativeGasUsed, 16);

        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);


        console.log('Querying for transactions with toAddress:', toAddress, 'created after:', tenMinutesAgo);

        const transaction = await Transactions.findOne({
            where: {
                toAddress,
                assetId: 'ETH',
                createdAt: {
                    [Op.gte]: tenMinutesAgo
                }
            }
        });

        if (transaction) {
            transaction.transactionHash = transactionHash;
            transaction.status = status;
            transaction.status = orderStatus
            transaction.blockNumber = blockNumber;
            transaction.gasUsed = gasUsed;
            transaction.effectiveGasPrice = effectiveGasPrice;
            transaction.cumulativeGasUsed = cumulativeGasUsed;

            await transaction.save();

            console.log('Transaction updated in database:', transaction.toJSON());

            res.status(200).send('Webhook received and transaction updated successfully.');
        } else {
            res.status(404).send('No matching transaction found for the given toAddress in the last 10 minutes.');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Internal server error.');
        next(error);
    }
};

module.exports = { ethWebhook };
