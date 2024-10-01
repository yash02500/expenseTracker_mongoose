const express = require('express');
const routes = express.Router();
const userControll = require('../controllers/userController');

routes.post('/signup', userControll.addUser);
routes.post('/login', userControll.login);
routes.post('/password/sendResetLink', userControll.sendResetLink);
routes.get('/password/forgotpassword/:id', userControll.checkForgotRequest);
routes.post('/password/forgotpassword/update/:id', userControll.updateForgotPassword);

module.exports = routes;