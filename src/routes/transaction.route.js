const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { route } = require('./store.route');

router.post('/create', transactionController.createTransaction);

router.post('/pay/:id', transactionController.payTransaction);

router.delete('/:id', transactionController.deleteTransaction);

router.get('/', transactionController.getAllTransactions);

module.exports = router;