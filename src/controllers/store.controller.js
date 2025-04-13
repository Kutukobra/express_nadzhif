const storeRepository = require('../repositories/store.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        baseResponse (
            res,
            true,
            200,
            'Stores found',
            stores
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error retrieving stores.',
            null
        );
    }
};

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse (
            res,
            false,
            400,
            'Missing store name or address.'
        );
    }
    try {
        const store = await storeRepository.createStore(req.body);
        baseResponse (
            res,
            true,
            201,
            'Store created.',
            store
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error creating store.'
        );
    }
};

exports.getStoreById = async (req, res) => {
    try {
        const store = await storeRepository.getStoreById(req.params.id);
        if (store == null) {
            return baseResponse (
                res,
                false,
                400,
                'Store not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Store found.',
            store
        )
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error retrieving store.'
        );
    }
};

exports.updateStore = async (req, res) => {
    try {
        const store = await storeRepository.updateStore(req.body);
        if (store == null) {
            return baseResponse (
                res,
                false,
                400,
                'Store not found.'
            )
        }
        baseResponse (
            res,
            true,
            200,
            'Store updated.',
            store
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error updating store.'
        );
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const store = await storeRepository.deleteStore(req.params.id);
        if (store == null) {
            return baseResponse (
                res,
                false,
                400,
                'Store not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Store deleted.',
            store
        );
    } catch (error) {
        baseResponse (
            res,
            false,
            500,
            error.message || 'Error deleting store.'
        );
    }
};