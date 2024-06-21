const express = require('express');
const { getAdminWallets } = require('../controller/getadminwallets');

const router = express.Router();

// Define the GET route
router.get('/', getAdminWallets);

module.exports = router;
