const express = require('express');
const Store = require('../db/store');
const { protect } = require('../middleware/auth');

function createSingletonRouter(collection, fallback = {}) {
    const router = express.Router();

    function readItem() {
        return Store.find(collection)[0] || null;
    }

    router.get('/', (req, res) => {
        try {
            res.json({ success: true, data: readItem() || fallback });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    });

    router.put('/', protect, (req, res) => {
        try {
            const existing = readItem();
            const payload = req.body || {};
            const item = existing
                ? Store.update(collection, existing._id, payload)
                : Store.create(collection, payload);
            res.json({ success: true, data: item });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    });

    return router;
}

module.exports = createSingletonRouter;