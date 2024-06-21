const models = require('../models/index');
const { Adminwallets } = models;

async function getAdminWallets(req, res) {
    try {
      const adminwallets = await Adminwallets.findAll({
        order: [["createdAt", "ASC"]],
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      });
  
      return res.status(200).json({ adminwallets });
    } catch (error) {
      console.error('Failed to get all admin wallets:', error);
      return res.status(500).json({ error: 'Failed to get all admin wallets' });
    }
  }

  
module.exports = { getAdminWallets };
  