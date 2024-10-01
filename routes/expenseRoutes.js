const express = require('express');
const userAuthentication =require('../middleware/auth');
const routes = express.Router();

const expControl = require('../controllers/expController');

routes.post('/addingExpense', userAuthentication.authenticate, expControl.addExpense);
routes.get('/getExpenses', userAuthentication.authenticate, expControl.getExpense);
routes.delete('/deleteExpense/:id', userAuthentication.authenticate, expControl.deleteExpenses);

module.exports = routes;