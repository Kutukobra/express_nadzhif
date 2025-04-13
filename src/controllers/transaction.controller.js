const transactionRepository = require('../repositories/transaction.repository');
const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
    if (req.body.quantity <= 0) {
        return baseResponse (
            res,
            false,
            400,
            'Quantity must be larger than 0.'
        );
    }
    try {
        const item = await itemRepository.getItemById(req.body.item_id); // Ambil data item dulu
        if (item == null) {
            return baseResponse (
                res,
                false,
                400,
                'Item not found.'
            );
        }
        const price = {total: item.price * req.body.quantity};
        const transaction = await transactionRepository.createTransaction({...req.body, ...price});
        baseResponse (
            res,
            true,
            200,
            'Transaction created.',
            transaction
        );
    } catch (error) {
        if (error.message === 'INVALID_USER_ID') {
            return baseResponse (
                res,
                false,
                400,
                'Invalid User ID.'
            );
        }

        baseResponse (
            res,
            false,
            500,
            error.message || 'Error creating transaction.'
        );
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.payTransaction(req.params.id);
        if (transaction == null) {
            return baseResponse (
                res,
                false,
                400,
                'Failed to pay.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Payment successful.',
            transaction
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Failed to pay.'
        );
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.deleteTransaction(req.params.id);

        if (transaction == null) {
            return baseResponse (
                res,
                false,
                400,
                'Transaction not found'
            )
        }
        baseResponse (
            res,
            true,
            200,
            'Transaction deleted',
            transaction
        )
        
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Failed to delete transaction.'
        );
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        baseResponse(
            res,
            true,
            200,
            'Transactions found',
            transactions
        )
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Failed to get transactions.'
        )
    }
};