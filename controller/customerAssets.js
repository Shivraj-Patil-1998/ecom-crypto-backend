require('dotenv').config();
const models = require('../models/index');
const {SubWalletAddress } = models;

const customerAssets = async (req, res) => {
    try {
      const { merchantId, customerId } = req.body;
      const parsedCustomerId = parseInt(customerId, 10); 
  
      const walletName = await SubWalletAddress.findAll({
        where: { walletId: merchantId, customerId: parsedCustomerId }, 
      });
  
      if (!walletName) {
        return res.status(404).json({ error: 'Wallets are not found under given merchants' });
      }
  
      return res.status(200).json({ walletName });
    } catch (error) {
      console.error('Failed to get Wallet Name:', error);
      return res.status(500).json({ error: 'Failed to get Wallet Name' });
    }
  }

module.exports = {customerAssets};
