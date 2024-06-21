const axios = require("axios");

module.exports.checkBtcBalance = async (address) => {
  try {
    const url = `https://blockstream.info/testnet/api/address/${address}`;
    const response = await axios.get(url);
    return (
      response.data.chain_stats.funded_txo_sum -
      response.data.chain_stats.spent_txo_sum
    );
  } catch (error) {
    throw new Error("Unable to fetch balance");
  }
};
