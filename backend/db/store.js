const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DB_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

function getFile(collection) {
    return path.join(DB_DIR, `${collection}.json`);
}

function readAll(collection) {
    const file = getFile(collection);
    if (!fs.existsSync(file)) return [];
    try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; }
}

function writeAll(collection, data) {
    fs.writeFileSync(getFile(collection), JSON.stringify(data, null, 2));
}

const Store = {
    find(collection, filter = {}) {
        let data = readAll(collection);
        Object.entries(filter).forEach(([k, v]) => {
            data = data.filter(item => item[k] === v);
        });
        return data;
    },
    findById(collection, id) {
        return readAll(collection).find(item => item._id === id) || null;
    },
    create(collection, doc) {
        const data = readAll(collection);
        const newDoc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...doc };
        data.push(newDoc);
        writeAll(collection, data);
        return newDoc;
    },
    update(collection, id, updates) {
        const data = readAll(collection);
        const idx = data.findIndex(item => item._id === id);
        if (idx === -1) return null;
        data[idx] = { ...data[idx], ...updates, updatedAt: new Date().toISOString() };
        writeAll(collection, data);
        return data[idx];
    },
    delete(collection, id) {
        const data = readAll(collection);
        const idx = data.findIndex(item => item._id === id);
        if (idx === -1) return null;
        const [deleted] = data.splice(idx, 1);
        writeAll(collection, data);
        return deleted;
    },
    count(collection, filter = {}) {
        return this.find(collection, filter).length;
    }
};

module.exports = Store;
