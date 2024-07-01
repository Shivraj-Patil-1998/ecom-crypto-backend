const express = require('express');
const { ethDestination } = require('../services/Notifications/Destination/alldestination');
const { getAllDestination } = require('../services/Notifications/Destination/getalldestination');
const { deleteDestination } = require('../services/Notifications/Destination/deletedestination-id');
const { getIdDestination } = require('../services/Notifications/Destination/get-id-destination');
const { ethcreateAlert } = require('../services/Notifications/Alert/createalert');
const { ethupdateAlert } = require('../services/Notifications/Alert/updatealert');

const router = express.Router();

// Destination
router.post('/all-destination', ethDestination);
router.post('/get-all-destination', getAllDestination);
router.post('/delete-destination', deleteDestination);
router.post('/get-id-destination', getIdDestination);

// Alerts create
router.post('/create-alert-eth', ethcreateAlert);
router.post('/update-alert-eth', ethupdateAlert);


module.exports = router;
