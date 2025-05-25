const path = require('path');
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');

const file = path.join(__dirname, '../db.json');
const adapter = new JSONFile(file);
const defaultData = { users: [] };
const db = new Low(adapter, defaultData);

(async () => {
    await db.read();   // db.data null bo‘lsa, defaultData yuklanadi
    await db.write();  // db.json faylini yaratadi/yozadi
})();

module.exports = db;
