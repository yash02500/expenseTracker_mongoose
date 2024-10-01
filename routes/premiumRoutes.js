const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumController = require('../controllers/premiumController');
const routes = express.Router();

routes.get('/premiumMembership', userAuthentication.authenticate, premiumController.buyPremium);
routes.post('/updateTransactionStatus', userAuthentication.authenticate, premiumController.updateTransactionStatus);

module.exports = routes;