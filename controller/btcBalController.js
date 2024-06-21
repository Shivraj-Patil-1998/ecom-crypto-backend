const models = require('../models/index');
const { checkBtcBalance } = require('./helper');

async function getBTCBalance(req, res) {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    return res
      .status(400)
      .send({ error: 'walletAddress query parameter is required' });
  }

  try {
    const balanceSatoshis = await checkBtcBalance(walletAddress);
    const balanceBTC = balanceSatoshis / 100000000; // Convert satoshis to BTC

    res.send({ balanceBTC });
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

module.exports = {
  getBTCBalance,
};
