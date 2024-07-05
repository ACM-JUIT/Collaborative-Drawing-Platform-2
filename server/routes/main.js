const express = require('express');
const router = express.Router();

const {
    createDocument,
    getDocuments,
    getDocumentById,
    updateDocument,
    deleteDocument,
} = require('../controllers/documentController');

router.post('/', createDocument);

router.get('/', getDocuments);

router.get('/:id', getDocumentById);

router.put('/:id', updateDocument);

router.delete('/:id', deleteDocument);

module.exports = router;
