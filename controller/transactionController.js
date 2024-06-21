const models = require('../models/index');
const { Transactions } = models;

async function getAllTransactions(req, res) {
  const { status, direction, asset, lastTen } = req.query;

  // Build the where clause based on the filters
  const whereClause = {};
  if (status) whereClause.status = status;
  if (direction) whereClause.transactiontype = direction; // Assuming direction maps to transactiontype
  if (asset) whereClause.assetId = asset;

  try {
    const options = {
      where: whereClause,
      order: [['createdAt', 'ASC']],
      attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
    };

    if (lastTen === 'true') {
      options.order = [['createdAt', 'DESC']];
      options.limit = 10;
    }

    const allTransactions = await Transactions.findAll(options);

    return res.status(200).json({ allTransactions });
  } catch (error) {
    console.error('Failed to get all Transaction:', error);
    return res.status(500).json({ error: 'Failed to get all Transaction' });
  }
}

module.exports = {
  getAllTransactions,
};
