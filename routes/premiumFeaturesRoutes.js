const express = require('express');
const userAuthentication = require('../middleware/auth');
const premiumFeatureController = require('../controllers/premiumFeature');
const routes = express.Router();

routes.get('/leaderboard', userAuthentication.authenticate, premiumFeatureController.leaderboard);
routes.get('/downloadReport', userAuthentication.authenticate, premiumFeatureController.downloadReports);
routes.get('/downloadList', userAuthentication.authenticate, premiumFeatureController.downloadList);
routes.get('/balance', userAuthentication.authenticate, premiumFeatureController.userBalance);

module.exports = routes;