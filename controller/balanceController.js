const { getDefaultProvider } = require("ethers");
const { formatEther } = require("ethers/lib/utils");
const models = require("../models/index");

const { EtherWallets } = models;

async function getBalance(req, res) {
  const { assetId } = req.params;

  if (!assetId) {
    return res
      .status(400)
      .send({ error: "assetId query parameter is required" });
  }

  try {
    const network = "sepolia";
    const provider = getDefaultProvider(network);
    const bal = await provider.getBalance(assetId);
    const balance = formatEther(bal);

    const updateBalance = await EtherWallets.update(
      { balance: parseFloat(balance) },
      { where: { address: assetId } }
    );

    if (!updateBalance) {
      res.status(500).send({ error: "Failed to update balance" });
    }

    res.send({ balance });
  } catch (error) {
    res.status(500).send({ error: error });
  }
}

module.exports = {
  getBalance,
};
