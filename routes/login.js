const express = require('express');
const { loginAuth } = require('../controller/loginController');
const router = express.Router();

router.post('/', loginAuth);

module.exports = router;
