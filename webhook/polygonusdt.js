const models = require("../models/index");
const { Transactions } = models;
const { Op } = require("sequelize");
const Web3 = require('web3');
const web3 = new Web3('https://smart-newest-card.matic-amoy.quiknode.pro/1c9bc1924a29f9e51d21315a330dbe3a41f19d6c/');

async function extractAddressAndValue(hexInput) {
    // Remove the '0x' prefix
    const data = hexInput.slice(2);

    // Define the positions based on the bit structure
    const functionSignatureLength = 8; // Function signature (4 bytes = 8 hex characters)
    const addressOffset = functionSignatureLength + 24; // Skip the function signature + 24 leading zeros (32 hex characters in total)
    const addressLength = 40; // Address length (20 bytes = 40 hex characters)
    const valueOffset = addressOffset + addressLength; // Value starts right after the address
    const valueLength = 64; // Value length (32 bytes = 64 hex characters)

    // Extract the address and value from the hex input
    const address = data.substring(addressOffset, addressOffset + addressLength);
    const value = data.substring(valueOffset, valueOffset + valueLength);

    // Convert the hexadecimal value to decimal
    const valueInDecimal = BigInt('0x' + value);

    return {
        address: '0x' + address,
        value: valueInDecimal.toString()
    };
}

const polygonusdtWebhook = async (req, res, next) => {
    try {
        const webhookData = req.body[0]; 
        if (!webhookData) {
            return res.status(400).send('Invalid webhook data');
        }

        let toAddress = webhookData.to.toLowerCase(); 

        if (!toAddress) {
            return res.status(400).send('toAddress is missing in webhook data');
        }

        const transactionHash = webhookData.transactionHash;
        const status = webhookData.blockNumber !== null ? 'COMPLETED' : 'FAILED';
        const orderStatus = webhookData.blockNumber !== null ? 'COMPLETED' : 'FAILED';
        const blockNumber = parseInt(webhookData.blockNumber, 16);
        const gasUsed = parseInt(webhookData.gasUsed, 16);
        const effectiveGasPrice = parseInt(webhookData.effectiveGasPrice, 16);
        const cumulativeGasUsed = parseInt(webhookData.cumulativeGasUsed, 16);
        const fromAddress = webhookData.from.toLowerCase();

        const transactionDetails = await web3.eth.getTransaction(transactionHash);

        if (!transactionDetails) {
            return res.status(404).send(`Transaction with hash ${transactionHash} not found on Ethereum`);
        }

        const { address: extractedAddress, value: extractedValue } = await extractAddressAndValue(transactionDetails.input);

        const valueInEth = web3.utils.fromWei(extractedValue, 'ether');

        const now = new Date();
        const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

        console.log("Current time:", now.toISOString());
        console.log("Ten minutes ago:", tenMinutesAgo.toISOString());

        const transactions = await Transactions.findOne({
            where: {
                toAddress: extractedAddress,
                assetId: 'USDT_POLYGON',
                createdAt: {
                    [Op.gt]: tenMinutesAgo
                }
            },
            order: [['createdAt', 'DESC']]
        });

        if (transactions) {
            transactions.transactionHash = transactionHash;
            transactions.status = webhookData.blockNumber !== null ? 'COMPLETED' : 'FAILED';
            transactions.orderStatus = webhookData.blockNumber !== null ? 'COMPLETED' : 'FAILED';
            transactions.blockNumber = blockNumber;
            transactions.gasUsed = gasUsed;
            transactions.effectiveGasPrice = effectiveGasPrice;
            transactions.cumulativeGasUsed = cumulativeGasUsed;
            transactions.fromAddress = fromAddress;
            transactions.amount = valueInEth;

            await transactions.save();
            console.log('Transaction updated in database:', transactions.toJSON());

            res.status(200).send('Webhook received and transaction updated successfully.');
        } else {
            console.log("No recent transactions found");
            res.status(404).send('No matching transaction found for the given toAddress in the last 10 minutes.');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).send('Internal server error.');
    }
};

module.exports = { polygonusdtWebhook };
