const Document = require('../models/Document');

exports.createDocument = async (req, res) => {
    try {
        const newDocument = new Document({
            title: req.body.title,
            content: req.body.content,
        });

        const document = await newDocument.save();
        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const documents = await Document.find();
        res.json(documents);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.getDocumentById = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.updateDocument = async (req, res) => {
    try {
        let document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        document.title = req.body.title || document.title;
        document.content = req.body.content || document.content;

        document = await Document.findByIdAndUpdate(
            req.params.id,
            { $set: document },
            { new: true }
        );

        res.json(document);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

exports.deleteDocument = async (req, res) => {
    try {
        const document = await Document.findById(req.params.id);

        if (!document) {
            return res.status(404).json({ msg: 'Document not found' });
        }

        await Document.findByIdAndRemove(req.params.id);

        res.json({ msg: 'Document removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
