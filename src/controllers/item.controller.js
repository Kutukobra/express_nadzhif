const itemRepository = require('../repositories/item.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createItem = async (req, res) => {
    console.log(req.file);
    if (!req.file) {
        return baseResponse (
            res,
            false,
            400,
            'No image file uploaded.'
        );
    }
    try {
        const item = await itemRepository.createItem({...req.body, ...req.file});
        baseResponse(
            res,
            true,
            200,
            'Item created',
            item
        );
    } catch (error) {
        if (error.message === 'STORE_ID_NONEXISTENT') {
            return baseResponse(
                res,
                false,
                400,
                'Store does not exist.'
            );
        }

        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to create item.'
        )
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        baseResponse (
            res,
            true,
            200,
            'Items found.',
            items
        )
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to get items.'
        )
    }
};

exports.getItemById = async (req, res) => {
    try {
        const item = await itemRepository.getItemById(req.params.id);
        if (item === null) {
            return baseResponse (
                res,
                false,
                400,
                'Item not found.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Item found.',
            item
        );
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to get item.'
        )
    }
};

exports.getItemsByStoreId = async (req, res) => {
    try {
        const items = await itemRepository.getItemsByStoreId(req.params.id);
        if (items === null) {
            return baseResponse (
                res,
                false,
                400,
                'Store does not exist.'
            );
        }
        baseResponse (
            res,
            true,
            200,
            'Items found.',
            items
        );
    } catch (error) {
        if (error.message === 'STORE_ID_NONEXISTENT') {
            return baseResponse (
                res,
                false,
                400,
                'Store does not exist.'
            );
        }

        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to get item.'
        )
    }
};

exports.updateItem = async (req, res) => {
    try {
        const item = await itemRepository.createItem({...req.body, ...req.file});
        baseResponse(
            res,
            true,
            200,
            'Item updated',
            item
        );
    } catch (error) {
        if (error.message === 'STORE_ID_NONEXISTENT') {
            return baseResponse (
                res,
                false,
                400,
                'Store does not exist.'
            );
        }

        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to update item.'
        )
    }
};

const cloudinary = require('cloudinary').v2;

exports.deleteItem = async (req, res) => {
    try {
        const item = await itemRepository.deleteItem(req.params.id);
        
        // To-do: Delete item pakai item.path ke cloudinary
        // Butuh parse url itu bro (RegEx maybe?)

        if (item == null) {
            return baseResponse (
                res,
                false,
                400,
                'Item not found'
            )
        }
        baseResponse (
            res,
            true,
            200,
            'Item deleted',
            item
        )
        
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || 'Failed to delete items.'
        )
    }
};