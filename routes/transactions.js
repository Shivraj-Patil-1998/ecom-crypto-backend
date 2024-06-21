const express = require('express');
const { getAllTransactions } = require('../controller/transactionController');
const { createTransactions } = require('../controller/createTransactions');

const router = express.Router();

// Define the GET route
router.get('/', getAllTransactions);
router.post('/create', createTransactions);

module.exports = router;
