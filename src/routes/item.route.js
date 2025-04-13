const express = require('express');
const router = express.Router();
const multer = require('multer');

const cloudinary = require('cloudinary').v2;
const {CloudinaryStorage} = require('multer-storage-cloudinary');

const itemController = require('../controllers/item.controller');

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'sbd',
        allowed_formats: ['jpg', 'png', 'jpeg']
    }
});

const upload = multer({storage});

router.post('/create', upload.single('file'), itemController.createItem);

router.get('/', itemController.getAllItems);

router.get('/byId/:id', itemController.getItemById);

router.get('/byStoreId/:id', itemController.getItemsByStoreId);

router.put('/', upload.single('file'), itemController.updateItem);

router.delete('/:id', itemController.deleteItem);

module.exports = router;